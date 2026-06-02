import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, MapPin, Copy, CheckCircle, Truck, Package, Lock, 
    BarChart2, User as UserIcon, Calendar, Printer, ExternalLink, Activity 
} from 'lucide-react';
import supplierService from '../services/supplierService';
import PaymentModal from '../components/PaymentModal';
import CourierDropdown from '../components/CourierDropdown';
import { validateTrackingNumber, getCourierExample } from '../utils/trackingValidator';
import './OrderDetailsPage.css';

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

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // 🟢 SWR CACHING: Memory/LocalStorage se instant initial load
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

    // --- STRICT DB VALUE AGGREGATION ---
    const dbTotals = useMemo(() => {
        if (!order) return { products: 0, profit: 0, commission: 0, supplierFixedFee: 0 };
        
        return order.order_items.reduce((acc, item) => {
            acc.products += (parseFloat(item.price_at_purchase) || 0) * item.quantity;
            acc.profit += parseFloat(item.profit) || 0; 
            acc.commission += parseFloat(item.system_commission) || 0;
            acc.supplierFixedFee += parseFloat(item.supplier_fixed_fee) || 0;
            return acc;
        }, { products: 0, profit: 0, commission: 0, supplierFixedFee: 0 });
    }, [order]);

    const isTrackable = useMemo(() => {
        if (!order?.shipment_details) return false;
        const { shipment_details } = order;
        const trackableStatuses = ['Order Dispatched', 'InTransit', 'OutForDelivery', 'FailedAttempt'];
        if (trackableStatuses.includes(shipment_details.current_status)) return true;
        if (shipment_details.current_status === 'Delivered') {
            const deliveryDate = new Date(shipment_details.updated_at);
            const twoDaysLater = new Date(deliveryDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            return new Date() < twoDaysLater;
        }
        return false;
    }, [order]);

    const fetchOrderDetails = useCallback(async () => {
        if (!orderId) {
            setError("Order ID is missing.");
            setIsPageLoading(false);
            return;
        }
        try {
            const data = await supplierService.getMyOrderDetails(orderId);
            setOrder(data);
            
            // Background Cache update
            localStorage.setItem(`swr_order_detail_${orderId}`, JSON.stringify(data));

            // Mark as seen logic (silenced background)
            if (data.shipment_details && data.shipment_details.is_seen === 0) {
                supplierService.markOrderAsSeen(orderId).catch(err => console.log("Mark seen error", err));
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

    const handleDispatch = async (e) => {
        e.preventDefault();
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
            await fetchOrderDetails(); // Refresh Page State
            setTrackingNumber('');
            setSelectedCourier(null);
        } catch (error) {
            alert("Failed to dispatch order.");
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

    const handleTrackOrder = () => {
        navigate(`/orders/track/${orderId}`);
    };

    // --- 🟢 BEAUTIFUL CREATIVE LOADER (SAME AS TRACK ORDER PAGE) ---
    if (isPageLoading && !order) return (
        <div className="order-loading-container">
            <div className="loader-logo"><img src="/logo.gif" alt="Loading..." /></div>
            <p>Syncing logistics data...</p>
        </div>
    );
    
    if (error && !order) return <div className="error-state">{error}</div>;
    if (!order) return <div className="error-state">Order not found.</div>;
    
    const { order_details, order_items, shipment_details, is_locked, unpaid_commission } = order;
    const isOrderNew = shipment_details.is_seen === 0; 
    const isAccountLocked = is_locked || false;
    const isOrderProcessing = shipment_details.current_status === 'processing';
    const showSensitiveDetails = !isAccountLocked || !isOrderProcessing;

    const DB_GRAND_TOTAL = parseFloat(order_details.total_price) || 0;
    const DB_DELIVERY_FEE = parseFloat(order_details.total_delivery_charge) || 0;

    // Creative Framer Motion Variants for page entry
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
            <div className="od-header">
                <button className="back-btn" onClick={() => navigate('/orders')}><ArrowLeft size={18} /> Back to Orders</button>
                <div className="od-title-group">
                    <h1>Order #{order_details.id.substring(0, 8).toUpperCase()}</h1>
                    {isOrderNew && <span className="new-tag-detail">NEW</span>}
                    <span className={`status-badge-lg status-${shipment_details.current_status}`}>{shipment_details.current_status.replace(/_/g, ' ')}</span>
                </div>
                <div className="od-meta">
                    <span><Calendar size={14}/> {new Date(order_details.created_at).toLocaleString()}</span>
                    <button className="print-btn" onClick={() => navigate('/orders/invoice', { state: { order } })}><Printer size={14}/> Print Invoice</button>
                </div>
            </div>

            <div className="od-grid">
                <div className="od-col-main">
                    <div className="od-card">
                        <div className="card-header"><Package size={20} /><h3>Ordered Items ({order_items.length})</h3></div>
                        <div className="product-list">
                            {order_items.map(item => {
                                const options = (item.options && typeof item.options === 'string') ? JSON.parse(item.options) : item.options || {};
                                const productTitle = item.product_details.title || 'N/A';
                                const productSKU = item.product_details.sku || 'N/A';
                                return (
                                <div key={item.id} className="od-product-item">
                                    <div className="od-prod-img-box"><img src={item.product_details.image || 'https://via.placeholder.com/70'} alt={productTitle} /></div>
                                    <div className="od-prod-info">
                                        <div className="info-line-copyable"><h4>{productTitle}</h4><button className="copy-icon-btn-sm" onClick={() => handleCopy(productTitle, `title-${item.id}`)}>{copyState[`title-${item.id}`] ? <CheckCircle size={14}/> : <Copy size={14}/>}</button></div>
                                        <div className="od-prod-meta">
                                            <div className="info-line-copyable"><span>SKU: {productSKU}</span><button className="copy-icon-btn-sm" onClick={() => handleCopy(productSKU, `sku-${item.id}`)}>{copyState[`sku-${item.id}`] ? <CheckCircle size={14}/> : <Copy size={14}/>}</button></div>
                                            {Object.keys(options).length > 0 && Object.entries(options).map(([key, value]) => (
                                                <span key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{String(value)}</strong></span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="od-prod-pricing">
                                        <div className="qty-badge">x {item.quantity}</div>
                                        <span className="price">PKR {(item.price_at_purchase * item.quantity).toLocaleString()}</span>
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

                <div className="od-col-side">
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
                        {!showSensitiveDetails && (
                            <div className="unlock-overlay" onClick={() => setIsPaymentModalOpen(true)}>
                                <Lock size={24} />
                                <span>Unlock to View Address</span>
                            </div>
                        )}
                    </div>
                    
                    {isOrderProcessing && showSensitiveDetails && (
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
                    
                    {!isOrderProcessing && shipment_details.tracking_number && (
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
                                   <button className="track-order-btn-detail" onClick={handleTrackOrder}>
                                       <Truck size={16}/> Track Order
                                   </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isPaymentModalOpen && ( <PaymentModal amountDue={unpaid_commission || 0} closeModal={() => setIsPaymentModalOpen(false)} /> )}
        </motion.div>
    );
};

export default OrderDetailsPage;