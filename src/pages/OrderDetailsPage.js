import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Copy, CheckCircle, Truck, Package, Lock, DollarSign, BarChart2, User as UserIcon, Calendar, Printer } from 'lucide-react';
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

    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [copyState, setCopyState] = useState({});
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingError, setTrackingError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Hooks must be at the top ---
    const financialTotals = useMemo(() => {
        if (!order) return { products: 0, delivery: 0, commission: 0, profit: 0, subtotal: 0, net: 0 };
        const totals = order.order_items.reduce((acc, item) => {
            acc.products += (parseFloat(item.price_at_purchase) || 0) * item.quantity;
            acc.delivery += (parseFloat(item.delivery_charge) || 0); // Calculated for display (Dummy)
            acc.commission += (parseFloat(item.system_commission) || 0);
            acc.profit += (parseFloat(item.profit) || 0);
            return acc;
        }, { products: 0, delivery: 0, commission: 0, profit: 0 });

        // MODIFIED: Exclude delivery from subtotal calculation as requested
        // totals.delivery is treated as a dummy value for display only.
        totals.subtotal = totals.products + totals.profit + totals.commission;
        
        totals.net = totals.products + totals.delivery - totals.commission;
        return totals;
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
    
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError("Order ID is missing.");
                setIsPageLoading(false);
                return;
            }
            setIsPageLoading(true);
            try {
                const data = await supplierService.getMyOrderDetails(orderId);
                setOrder(data);
            } catch (err) {
                console.error("Fetch Details Error:", err);
                setError("Failed to load order details.");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

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
            const data = await supplierService.getMyOrderDetails(orderId);
            setOrder(data);
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

    // --- Render Logic ---
    if (isPageLoading) return <div className="loading-state">Loading...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!order) return <div className="error-state">Order not found.</div>;
    
    const { order_details, order_items, shipment_details, is_locked, unpaid_commission, is_new } = order;
    const isAccountLocked = is_locked || false;
    const isOrderProcessing = shipment_details.current_status === 'processing';
    const showSensitiveDetails = !isAccountLocked || !isOrderProcessing;

    // MODIFIED: Calculate Final Total by subtracting 200 as requested
    const deliveryDeduction = 200;
    const finalTotalDisplay = (order_details.total_price || 0) - deliveryDeduction;

    return (
        <div className="order-details-page">
            <motion.div className="od-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <button className="back-btn" onClick={() => navigate('/orders')}><ArrowLeft size={18} /> Back to Orders</button>
                <div className="od-title-group">
                    <h1>Order #{order_details.id.substring(0, 8).toUpperCase()}</h1>
                    {is_new && <span className="new-tag-detail">NEW</span>}
                    <span className={`status-badge-lg status-${shipment_details.current_status}`}>{shipment_details.current_status.replace(/_/g, ' ')}</span>
                </div>
                <div className="od-meta">
                    <span><Calendar size={14}/> {new Date(order_details.created_at).toLocaleString()}</span>
                    <button className="print-btn" onClick={() => navigate('/orders/invoice', { state: { order } })}><Printer size={14}/> Print Invoice</button>
                </div>
            </motion.div>

            <div className="od-grid">
                <div className="od-col-main">
                    <motion.div className="od-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} initial="hidden" animate="visible">
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
                    </motion.div>
                    
                    <motion.div className="od-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <div className="card-header"><BarChart2 size={20} className="icon-green"/><h3>Price Calculation</h3></div>
                        <div className="od-summary">
                            <div className="summary-row"><span>Product(s) Price</span><span>PKR {financialTotals.products.toLocaleString()}</span></div>
                            <div className="summary-row profit"><span>User (Reseller) Profit</span><span>+ PKR {financialTotals.profit.toLocaleString()}</span></div>
                            {/* MODIFIED: Delivery Fee is shown but treated as dummy/not added to calculation */}
                            <div className="summary-row"><span>Delivery Fee (Paid by User)</span><span>PKR {financialTotals.delivery.toLocaleString()}</span></div>
                            <div className="summary-row"><span>SJ10 Fee (Commission)</span><span>+ PKR {financialTotals.commission.toLocaleString()}</span></div>
                            {/* MODIFIED: Total Amount subtracted by 200 */}
                            <div className="summary-row total"><span>Total Amount from Customer</span><span>PKR {finalTotalDisplay.toLocaleString()}</span></div>
                        </div>
                    </motion.div>
                </div>

                <div className="od-col-side">
                    <motion.div className="od-card shipping-card-container" variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="card-header"><MapPin size={20} className="icon-purple"/><h3>Shipping Details</h3></div>
                        <div className={`shipping-content ${!showSensitiveDetails ? 'blurred' : ''}`}>
                            <div className="customer-info-box">
                                <div className="info-line"><UserIcon size={16}/><strong>{order_details.customer_name}</strong><button className="copy-icon-btn" onClick={() => handleCopy(order_details.customer_name, 'name')}>{copyState.name ? <CheckCircle size={14}/> : <Copy size={14}/>}</button></div>
                                <div className="info-line"><span className="label">Phone:</span> {order_details.customer_phone}<button className="copy-icon-btn" onClick={() => handleCopy(order_details.customer_phone, 'phone')}>{copyState.phone ? <CheckCircle size={14}/> : <Copy size={14}/>}</button></div>
                                <div className="info-line address"><span className="label">Address:</span><p>{order_details.customer_address}, {order_details.customer_city}</p><button className="copy-icon-btn" onClick={() => handleCopy(`${order_details.customer_address}, ${order_details.customer_city}`, 'address')}>{copyState.address ? <CheckCircle size={14}/> : <Copy size={14}/>}</button></div>
                            </div>
                        </div>
                        {!showSensitiveDetails && (
                            <div className="unlock-overlay" onClick={() => setIsPaymentModalOpen(true)}>
                                <Lock size={24} />
                                <span>Unlock to View Address</span>
                            </div>
                        )}
                    </motion.div>
                    
                    {isOrderProcessing && showSensitiveDetails && (
                       <motion.div className="od-card" variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}>
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
                       </motion.div>
                    )}
                    
                    {!isOrderProcessing && shipment_details.tracking_number && (
                        <motion.div className="od-card" variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}>
                           <div className="card-header"><Package size={20}/><h3>Tracking Information</h3></div>
                            <div className="tracking-display">
                                <div className="tracking-row"><span className="t-label">Courier:</span><span className="t-val">{shipment_details.courier_name}</span></div>
                                <div className="tracking-row"><span className="t-label">Tracking #:</span><span className="t-val highlight">{shipment_details.tracking_number}</span></div>
                                {isTrackable && (
                                   <button className="track-order-btn-detail" onClick={handleTrackOrder}><Truck size={16}/> Track Order</button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            {isPaymentModalOpen && ( <PaymentModal amountDue={unpaid_commission || 0} closeModal={() => setIsPaymentModalOpen(false)} /> )}
        </div>
    );
};

export default OrderDetailsPage;