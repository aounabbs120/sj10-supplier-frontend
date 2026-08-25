// src/pages/OrderDetailsPage.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, MapPin, Copy, CheckCircle, Truck, Package, Lock, 
    BarChart2, User as UserIcon, Calendar, Printer, AlertCircle, 
    Clock, XCircle, X, ShieldAlert 
} from 'lucide-react';
import supplierService from '../services/supplierService';
import PaymentModal from '../components/PaymentModal';
import CourierDropdown from '../components/CourierDropdown';
import { validateTrackingNumber, getCourierExample } from '../utils/trackingValidator';
import axios from 'axios'; // 🟢 Import axios for safe fallback
import './OrderDetailsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://sj1osupplierbackend1.vercel.app';

const COURIER_LIST = [
    { code: 'leopards', name: 'Leopards Courier', logo: '/logos/leopards.png' },
    { code: 'tcs', name: 'TCS', logo: '/logos/tcs.png' },
    { code: 'postex', name: 'PostEx', logo: '/logos/postex.png' },
    { code: 'm-p', name: 'M&P (OCS)', logo: '/logos/mnp.png' },
    { code: 'call-courier', name: 'Call Courier', logo: '/logos/call-courier.png' },
    { code: 'daewoo', name: 'Daewoo Express', logo: '/logos/daewoo.png' },
    { code: 'trax', name: 'Trax', logo: '/logos/trax.png' },
    { code: 'swyft', name: 'Swyft', logo: '/logos/swyft.png' },
    { code: 'dhl', name: 'DHL', logo: '/logos/dhl.png' },
    { code: 'fedex', name: 'FedEx', logo: '/logos/fedex.png' },
];

const CANCEL_REASONS = [
    "Item Out of Stock / Sold Out",
    "Item Damaged / Quality Issue",
    "Delivery Area Unserviceable / Address Incomplete",
    "Pricing / Inventory Discrepancy",
    "Supplier Warehouse Delayed / Emergency",
    "Other"
];

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // SWR CACHING
    const [order, setOrder] = useState(() => {
        const cached = localStorage.getItem(`swr_order_detail_${orderId}`);
        return cached ? JSON.parse(cached) : null;
    });

    const [error, setError] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(!order);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [copyState, setCopyState] = useState({});
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingError, setTrackingError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🟢 MAIN ORDER CANCEL MODAL STATES
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
    const [isCancelling, setIsCancelling] = useState(false);
    
    // 🟢 SINGLE ITEM CANCEL MODAL STATES
    const [isItemCancelModalOpen, setIsItemCancelModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // --- STRICT DB VALUE AGGREGATION ---
    const dbTotals = useMemo(() => {
        if (!order || !order.order_items) return { products: 0, profit: 0, commission: 0, supplierFixedFee: 0 };
        
        return order.order_items.reduce((acc, item) => {
            // Sirf active items ka total calculate karein
            if (item.commission_status !== 'cancelled') {
                acc.products += (parseFloat(item.price_at_purchase) || 0) * item.quantity;
                acc.profit += parseFloat(item.profit) || 0; 
                acc.commission += parseFloat(item.system_commission) || 0;
                acc.supplierFixedFee += parseFloat(item.supplier_fixed_fee) || 0;
            }
            return acc;
        }, { products: 0, profit: 0, commission: 0, supplierFixedFee: 0 });
    }, [order]);

    const isPendingWhatsApp = useMemo(() => {
        if (!order || !order.order_details) return false;
        return order.order_details.confirmation_status === 'pending_whatsapp' || 
               order.order_details.is_pending_whatsapp === true;
    }, [order]);

    const isTrackable = useMemo(() => {
        if (!order?.shipment_details || isPendingWhatsApp) return false;
        const { shipment_details } = order;
        const trackableStatuses = ['Order Dispatched', 'InTransit', 'OutForDelivery', 'FailedAttempt'];
        if (trackableStatuses.includes(shipment_details.current_status)) return true;
        if (shipment_details.current_status === 'Delivered') {
            const deliveryDate = new Date(shipment_details.updated_at || shipment_details.created_at);
            const twoDaysLater = new Date(deliveryDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            return new Date() < twoDaysLater;
        }
        return false;
    }, [order, isPendingWhatsApp]);

    const fetchOrderDetails = useCallback(async () => {
        if (!orderId) {
            setError("Order ID is missing.");
            setIsPageLoading(false);
            return;
        }
        try {
            const data = await supplierService.getMyOrderDetails(orderId);
            setOrder(data);
            localStorage.setItem(`swr_order_detail_${orderId}`, JSON.stringify(data));

            if (data.shipment_details && data.shipment_details.is_seen === 0) {
                supplierService.markOrderAsSeen(orderId).catch(() => {});
            }
        } catch (err) {
            console.error("Fetch Details Error:", err);
            if (!order) setError("Failed to load order details.");
        } finally {
            setIsPageLoading(false);
        }
    }, [orderId, order]);
    
    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopyState({ [field]: true });
        setTimeout(() => setCopyState({}), 2000);
    };

    // 🟢 DISPATCH HANDLER
    const handleDispatch = async (e) => {
        e.preventDefault();
        if (isPendingWhatsApp) {
            alert("Customer confirmation is pending. You cannot dispatch this order yet.");
            return;
        }
        const validation = validateTrackingNumber(selectedCourier?.code, trackingNumber);
        if (!validation.isValid) {
            setTrackingError(validation.message);
            return;
        }
        setIsSubmitting(true);
        try {
            await supplierService.addTrackingToShipment(order.shipment_details.id, {
                tracking_number: trackingNumber,
                courier_name: selectedCourier.code
            });
            await fetchOrderDetails();
            setTrackingNumber('');
            setSelectedCourier(null);
            alert("Order dispatched successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to dispatch order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTrackingNumberChange = (e) => {
        const newTrackingNumber = e.target.value;
        setTrackingNumber(newTrackingNumber);
        const validation = validateTrackingNumber(selectedCourier?.code, newTrackingNumber);
        setTrackingError(newTrackingNumber ? (validation.isValid ? '' : validation.message) : '');
    };

    // 🟢 SUPPLIER CANCEL ORDER HANDLER (FULL PACKAGE)
    const handleCancelOrderSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReason) return alert("Please select a cancellation reason.");

        setIsCancelling(true);
        try {
            if (supplierService.cancelOrderBySupplier) {
                await supplierService.cancelOrderBySupplier(orderId, selectedReason);
            } else {
                await axios.put(`${API_BASE_URL}/api/orders/${orderId}/cancel`, { reason: selectedReason }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('supplierToken')}` }
                });
            }
            setIsCancelModalOpen(false);
            await fetchOrderDetails();
            alert("Order package has been cancelled.");
        } catch (err) {
            alert(err.response?.data?.message || "Cancellation failed. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    // 🟢 SUPPLIER CANCEL SINGLE ITEM HANDLER
    const handleCancelItemSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReason || !selectedItemId) return alert("Please select a cancellation reason.");

        setIsCancelling(true);
        try {
            if (supplierService.cancelSingleItem) {
                await supplierService.cancelSingleItem(orderId, selectedItemId, selectedReason);
            } else {
                // Direct Axios Fallback (In case service is missing)
                await axios.put(`${API_BASE_URL}/api/orders/${orderId}/items/${selectedItemId}/cancel`, { reason: selectedReason }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('supplierToken')}` }
                });
            }
            setIsItemCancelModalOpen(false);
            setSelectedItemId(null);
            await fetchOrderDetails();
            alert("Item has been successfully cancelled and your bill is updated.");
        } catch (err) {
            alert(err.response?.data?.message || "Item cancellation failed. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (isPageLoading && !order) return (
        <div className="order-loading-container">
            <div className="loader-logo"><img src="/logo.gif" alt="Loading..." /></div>
            <p>Syncing logistics data...</p>
        </div>
    );
    
    if (error && !order) return <div className="error-state">{error}</div>;
    if (!order) return <div className="error-state">Order not found.</div>;
    
    const { order_details = {}, order_items = [], shipment_details = {}, is_locked, unpaid_commission } = order;
    const isOrderNew = shipment_details.is_seen === 0; 
    const isAccountLocked = is_locked || false;
    
    const currentStatusLower = (shipment_details.current_status || order_details.status || '').toLowerCase();
    const isOrderCancelled = currentStatusLower === 'cancelled' || currentStatusLower === 'auto_cancelled';
    const isOrderProcessing = currentStatusLower === 'processing' || currentStatusLower === 'pending_confirmation';
    const showSensitiveDetails = (!isAccountLocked || !isOrderProcessing) && !isPendingWhatsApp;

    const DB_GRAND_TOTAL = parseFloat(order_details.total_price) || 0;
    const DB_DELIVERY_FEE = parseFloat(order_details.total_delivery_charge) || 0;
    const cancellationReason = shipment_details.cancellation_reason || order_details.cancellation_reason;

    // 🟢 Active Items Count Logic (Checks if > 1 item is active)
    const activeItemsCount = order_items.filter(item => item.commission_status !== 'cancelled').length;
    const canShowItemCancelBtn = activeItemsCount > 1;

    const pageTransitionVariants = {
        initial: { opacity: 0, scale: 0.98, y: 15 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <motion.div 
            className="order-details-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
        >
            {/* 🔴 CANCELLED ORDER BANNER */}
            {isOrderCancelled && (
                <div className="cancelled-alert-banner">
                    <AlertCircle size={22} color="#dc2626" />
                    <div>
                        <strong>Order Cancelled</strong>
                        <span>This order package was cancelled. {cancellationReason ? `Reason: "${cancellationReason}"` : ''}</span>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="od-header">
                <button className="back-btn" onClick={() => navigate('/orders')}>
                    <ArrowLeft size={18} /> Back to Orders
                </button>
                
                <div className="od-title-group">
                    <h1>Order #{order_details.id.substring(0, 8).toUpperCase()}</h1>
                    {isOrderNew && <span className="new-tag-detail">NEW</span>}
                    
                    {isPendingWhatsApp ? (
                        <span className="status-badge-lg status-pending-wa">
                            <Clock size={13} style={{ display: 'inline', marginRight: 4 }} /> 
                            Awaiting Customer WhatsApp Reply
                        </span>
                    ) : (
                        <span className={`status-badge-lg status-${shipment_details.current_status || 'processing'}`}>
                            {(shipment_details.current_status || 'Processing').replace(/_/g, ' ')}
                        </span>
                    )}
                </div>

                <div className="od-meta">
                    <span><Calendar size={14}/> {new Date(order_details.created_at).toLocaleString()}</span>
                    
                    <div className="od-header-actions-group">
                        <button className="print-btn" onClick={() => navigate('/orders/invoice', { state: { order } })}>
                            <Printer size={14}/> Print Invoice
                        </button>

                        {/* 🟢 RED CANCEL ORDER BUTTON (For Full Package) */}
                        {!isOrderCancelled && activeItemsCount > 0 && (
                            <button className="cancel-order-header-btn" onClick={() => setIsCancelModalOpen(true)}>
                                <XCircle size={14}/> Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="od-grid">
                
                {/* LEFT: PRODUCTS & BILLING */}
                <div className="od-col-main">
                    <div className="od-card">
                        <div className="card-header">
                            <Package size={20} />
                            <h3>Ordered Items ({order_items.length})</h3>
                        </div>
                        <div className="product-list">
                            {order_items.map((item) => {
                                const options = (item.options && typeof item.options === 'string') ? JSON.parse(item.options) : item.options || {};
                                const productTitle = item.product_details?.title || 'N/A';
                                const productSKU = item.product_details?.sku || 'N/A';
                                const isItemCancelled = item.commission_status === 'cancelled';
                                
                                return (
                                <div 
                                    key={item.id} 
                                    className="od-product-item"
                                    style={isItemCancelled ? { opacity: 0.5, filter: 'grayscale(100%)', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px dashed #cbd5e1' } : {}}
                                >
                                    <div className="od-prod-img-box">
                                        <img src={item.product_details?.image || 'https://via.placeholder.com/70'} alt={productTitle} />
                                    </div>
                                    <div className="od-prod-info">
                                        <div className="info-line-copyable">
                                            <h4 style={isItemCancelled ? { textDecoration: 'line-through', color: '#64748b' } : {}}>{productTitle}</h4>
                                            {!isItemCancelled && (
                                                <button className="copy-icon-btn-sm" onClick={() => handleCopy(productTitle, `title-${item.id}`)}>
                                                    {copyState[`title-${item.id}`] ? <CheckCircle size={14}/> : <Copy size={14}/>}
                                                </button>
                                            )}
                                        </div>
                                        <div className="od-prod-meta">
                                            <div className="info-line-copyable">
                                                <span>SKU: {productSKU}</span>
                                                {!isItemCancelled && (
                                                    <button className="copy-icon-btn-sm" onClick={() => handleCopy(productSKU, `sku-${item.id}`)}>
                                                        {copyState[`sku-${item.id}`] ? <CheckCircle size={14}/> : <Copy size={14}/>}
                                                    </button>
                                                )}
                                            </div>
                                            {Object.keys(options).length > 0 && Object.entries(options).map(([key, value]) => (
                                                <span key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{String(value)}</strong></span>
                                            ))}
                                        </div>

                                        {/* 🔴 ITEM CANCELLED BADGE */}
                                        {isItemCancelled && (
                                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#dc2626', fontWeight: 800 }}>
                                                ❌ ITEM CANCELLED
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="od-prod-pricing" style={{ textAlign: 'right' }}>
                                        <div className="qty-badge">x {item.quantity}</div>
                                        <span 
                                            className="price" 
                                            style={isItemCancelled ? { textDecoration: 'line-through', color: '#94a3b8' } : {}}
                                        >
                                            PKR {(item.price_at_purchase * item.quantity).toLocaleString()}
                                        </span>
                                        
                                        {/* 🟢 BEAUTIFUL ANIMATED CANCEL ITEM BUTTON (Only shows if >1 active items) */}
                                        {!isOrderCancelled && !isItemCancelled && !isPendingWhatsApp && !['dispatched', 'in_transit', 'out_for_delivery', 'delivered'].includes(currentStatusLower) && canShowItemCancelBtn && (
                                            <motion.button 
                                                whileHover={{ scale: 1.05, backgroundColor: '#fca5a5', color: '#7f1d1d' }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => { setSelectedItemId(item.id); setIsItemCancelModalOpen(true); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px',
                                                    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                                                    padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                                                    transition: 'background 0.2s'
                                                }}
                                            >
                                                <XCircle size={14} /> Cancel Item
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    
                    <div className="od-card">
                        <div className="card-header"><BarChart2 size={20} className="icon-green"/><h3>Price Calculation</h3></div>
                        <div className="od-summary">
                            <div className="summary-row"><span>Product(s) Price</span><span>PKR {dbTotals.products.toLocaleString()}</span></div>
                            <div className="summary-row"><span>Delivery Fee</span><span>+ PKR {DB_DELIVERY_FEE.toLocaleString()}</span></div>
                            {dbTotals.profit > 0 && (
                                <div className="summary-row profit"><span>User (Reseller) Profit</span><span>+ PKR {dbTotals.profit.toLocaleString()}</span></div>
                            )}
                            <div className="summary-row"><span>SJ10 Fee (Commission)</span><span>+ PKR {dbTotals.commission.toLocaleString()}</span></div>
                            <div className="summary-row total"><span>Customer Payable (Grand Total)</span><span>PKR {DB_GRAND_TOTAL.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SHIPPING & DISPATCH */}
                <div className="od-col-side">
                    
                    {/* SHIPPING DETAILS CARD */}
                    <div className="od-card shipping-card-container">
                        <div className="card-header"><MapPin size={20} className="icon-purple"/><h3>Shipping Details</h3></div>
                        
                        <div className={`shipping-content ${!showSensitiveDetails ? 'blurred' : ''}`}>
                            <div className="customer-info-box">
                                <div className="info-line">
                                    <span className="copyable-wrapper">
                                        <UserIcon size={16}/><strong>{order_details.customer_name}</strong>
                                    </span>
                                    <button className="copy-icon-btn" onClick={() => handleCopy(order_details.customer_name, 'name')}>{copyState.name ? <CheckCircle size={14}/> : <Copy size={14}/>}</button>
                                </div>
                                <div className="info-line">
                                    <span className="copyable-wrapper">
                                        <span className="label">Phone:</span> {order_details.customer_phone}
                                    </span>
                                    <button className="copy-icon-btn" onClick={() => handleCopy(order_details.customer_phone, 'phone')}>{copyState.phone ? <CheckCircle size={14}/> : <Copy size={14}/>}</button>
                                </div>
                                <div className="info-line address">
                                    <span className="copyable-wrapper">
                                        <span className="label">Address:</span>
                                        <p>{order_details.customer_address}, {order_details.customer_city}</p>
                                    </span>
                                    <button className="copy-icon-btn" onClick={() => handleCopy(`${order_details.customer_address}, ${order_details.customer_city}`, 'address')}>{copyState.address ? <CheckCircle size={14}/> : <Copy size={14}/>}</button>
                                </div>
                            </div>
                        </div>

                        {/* Blurred Overlays */}
                        {isPendingWhatsApp && (
                            <div className="unconfirmed-shipping-overlay">
                                <Clock size={26} color="#d97706" />
                                <span>Awaiting WhatsApp Confirmation</span>
                                <small>Address will be revealed once customer confirms order.</small>
                            </div>
                        )}

                        {!isPendingWhatsApp && !showSensitiveDetails && (
                            <div className="unlock-overlay" onClick={() => setIsPaymentModalOpen(true)}>
                                <Lock size={24} />
                                <span>Unlock to View Address</span>
                            </div>
                        )}
                    </div>
                    
                    {/* 🟢 DISPATCH FORM OR LOCKED DISPATCH STATE */}
                    {isPendingWhatsApp ? (
                        <div className="od-card dispatch-locked-card">
                            <div className="card-header">
                                <Clock size={20} color="#d97706"/>
                                <h3>Dispatch on Hold</h3>
                            </div>
                            <div className="unconfirmed-dispatch-notice">
                                <p>Customer has not confirmed this order via WhatsApp yet. You will be able to book courier and dispatch once confirmed.</p>
                            </div>
                        </div>
                    ) : isOrderProcessing && showSensitiveDetails && (
                       <div className="od-card">
                           <div className="card-header"><Truck size={20} className="icon-green"/><h3>Dispatch This Order</h3></div>
                           <form onSubmit={handleDispatch} className="dispatch-form">
                               <div className="form-input-group">
                                   <label>Courier Service</label>
                                   <CourierDropdown options={COURIER_LIST} selected={selectedCourier} onSelect={setSelectedCourier} />
                               </div>
                               <div className="form-input-group">
                                   <label>Tracking Number</label>
                                   <input type="text" placeholder={getCourierExample(selectedCourier?.code)} value={trackingNumber} onChange={handleTrackingNumberChange} required disabled={!selectedCourier} />
                                   {trackingError && <p className="form-error">{trackingError}</p>}
                               </div>
                               <button type="submit" className="dispatch-submit-btn" disabled={isSubmitting || !selectedCourier || !!trackingError}>
                                   {isSubmitting ? 'Dispatching...' : <><Package size={18}/> Confirm Dispatch</>}
                               </button>
                           </form>
                       </div>
                    )}
                    
                    {/* TRACKING INFO (WHEN DISPATCHED) */}
                    {!isOrderProcessing && !isOrderCancelled && shipment_details.tracking_number && (
                        <div className="od-card">
                           <div className="card-header"><Package size={20}/><h3>Tracking Information</h3></div>
                            <div className="tracking-display-modern">
                                <div className="tracking-details-info">
                                    <div className="tracking-row-modern">
                                        <span className="t-label">Courier Service</span>
                                        <strong className="t-val">{shipment_details.courier_name?.toUpperCase()}</strong>
                                    </div>
                                    <div className="tracking-row-modern">
                                        <span className="t-label">Tracking ID</span>
                                        <div className="tracking-code-copyable">
                                            <code>{shipment_details.tracking_number}</code>
                                            <button className="copy-action-btn-modern" onClick={() => handleCopy(shipment_details.tracking_number, 'track-id')}>
                                                {copyState['track-id'] ? <CheckCircle size={14}/> : <Copy size={14}/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {isTrackable && (
                                   <button className="track-order-btn-detail" onClick={() => navigate(`/orders/track/${orderId}`)}>
                                       <Truck size={16}/> Track Order
                                   </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🟢 FULL ORDER CANCEL MODAL */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    <div className="cancel-modal-overlay" onClick={() => setIsCancelModalOpen(false)}>
                        <motion.div 
                            className="cancel-modal-box"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="cancel-modal-header">
                                <div className="cancel-title-wrap">
                                    <ShieldAlert size={22} color="#dc2626" />
                                    <h3>Cancel Entire Order</h3>
                                </div>
                                <button className="cancel-close-btn" onClick={() => setIsCancelModalOpen(false)}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCancelOrderSubmit}>
                                <p className="cancel-modal-desc">
                                    Please select a reason for cancelling Order <strong>#{order_details.id.substring(0,8).toUpperCase()}</strong>. The customer will be informed via WhatsApp.
                                </p>

                                <div className="form-input-group" style={{ marginBottom: '20px' }}>
                                    <label>Cancellation Reason *</label>
                                    <select 
                                        value={selectedReason} 
                                        onChange={e => setSelectedReason(e.target.value)}
                                        className="cancel-reason-select"
                                        required
                                    >
                                        {CANCEL_REASONS.map((r, i) => (
                                            <option key={i} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="cancel-modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn-cancel-back" 
                                        onClick={() => setIsCancelModalOpen(false)}
                                        disabled={isCancelling}
                                    >
                                        Go Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-cancel-confirm"
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🟢 SINGLE ITEM CANCEL MODAL */}
            <AnimatePresence>
                {isItemCancelModalOpen && (
                    <div className="cancel-modal-overlay" onClick={() => setIsItemCancelModalOpen(false)}>
                        <motion.div 
                            className="cancel-modal-box"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="cancel-modal-header">
                                <div className="cancel-title-wrap">
                                    <ShieldAlert size={22} color="#dc2626" />
                                    <h3>Cancel Single Item</h3>
                                </div>
                                <button className="cancel-close-btn" onClick={() => setIsItemCancelModalOpen(false)}><X size={18} /></button>
                            </div>

                            <form onSubmit={handleCancelItemSubmit}>
                                <p className="cancel-modal-desc">
                                    Please select a reason for cancelling this specific item. Its price will be automatically deducted from the customer's total bill.
                                </p>

                                <div className="form-input-group" style={{ marginBottom: '20px' }}>
                                    <label>Cancellation Reason *</label>
                                    <select value={selectedReason} onChange={e => setSelectedReason(e.target.value)} className="cancel-reason-select" required>
                                        {CANCEL_REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div className="cancel-modal-actions">
                                    <button type="button" className="btn-cancel-back" onClick={() => setIsItemCancelModalOpen(false)} disabled={isCancelling}>Go Back</button>
                                    <button type="submit" className="btn-cancel-confirm" disabled={isCancelling}>{isCancelling ? 'Processing...' : 'Cancel Item'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYMENT MODAL (FOR DEBT UNLOCK) */}
            {isPaymentModalOpen && ( 
                <PaymentModal 
                    amountDue={unpaid_commission || 0} 
                    closeModal={() => setIsPaymentModalOpen(false)} 
                /> 
            )}
        </motion.div>
    );
};

export default OrderDetailsPage;