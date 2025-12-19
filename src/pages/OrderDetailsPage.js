// src/pages/OrderDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, MapPin, Copy, CheckCircle, Truck, Package, 
    Calendar, User, CreditCard, Box 
} from 'lucide-react';
import supplierService from '../services/supplierService';
import './OrderDetailsPage.css';

const OrderDetailsPage = ({ setIsLoading }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    
    // UI States
    const [isAddressCopied, setIsAddressCopied] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [courierName, setCourierName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            // Only set global loader if prop exists, otherwise handle locally
            if(setIsLoading) setIsLoading(true);
            
            try {
                // Now calling the function we just added to supplierService
                const data = await supplierService.getMyOrderDetails(orderId);
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details. Please try again.");
            } finally {
                if(setIsLoading) setIsLoading(false);
            }
        };

        if (orderId) {
            fetchDetails();
        }
    }, [orderId, setIsLoading]);

    // --- HANDLERS ---
    const handleCopyAddress = () => {
        if (!order) return;
        const { order_details } = order;
        const addressText = `Name: ${order_details.customer_name}\nPhone: ${order_details.customer_phone}\nAddress: ${order_details.customer_address}\nCity: ${order_details.customer_city}`;
        
        navigator.clipboard.writeText(addressText);
        setIsAddressCopied(true);
        setTimeout(() => setIsAddressCopied(false), 2000);
    };

    const handleDispatch = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await supplierService.addTrackingToShipment(order.shipment_details.id, {
                tracking_number: trackingNumber,
                courier_name: courierName
            });
            // Refresh data
            const updated = await supplierService.getMyOrderDetails(orderId);
            setOrder(updated);
            alert("✅ Order Dispatched Successfully!");
        } catch (error) {
            alert("❌ Failed to update tracking info.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER STATES ---

    // 1. Error State
    if (error) {
        return (
            <div className="order-details-page" style={{textAlign:'center', paddingTop:'50px'}}>
                 <h2 style={{color: '#ef4444'}}>Something went wrong</h2>
                 <p>{error}</p>
                 <button className="back-btn" onClick={() => navigate('/orders')} style={{margin:'20px auto'}}>
                    <ArrowLeft size={20} /> Back to Orders
                 </button>
            </div>
        );
    }

    // 2. Loading State (Prevents White Page)
    if (!order) {
        return (
            <div className="order-details-page">
                <div style={{display:'flex', justifyContent:'center', marginTop:'100px'}}>
                    <div className="spinner" style={{width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div>
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // 3. Success State
    const { order_details, order_items, shipment_details } = order;
    const status = shipment_details.current_status;

    return (
        <div className="order-details-page">
            {/* HEADER */}
            <div className="od-header">
                <button className="back-btn" onClick={() => navigate('/orders')}>
                    <ArrowLeft size={20} /> Back to Orders
                </button>
                <div className="od-title-group">
                    <h1>Order #{order_details.id}</h1>
                    <span className={`status-badge-lg status-${status}`}>
                        {status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                <div className="od-meta">
                    <span><Calendar size={14}/> Placed on: {new Date(order_details.created_at).toLocaleString()}</span>
                </div>
            </div>

            <div className="od-grid">
                
                {/* --- PRODUCTS SECTION --- */}
                <div className="od-col-main">
                    <motion.div 
                        className="od-card products-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="card-header">
                            <Box size={20} className="icon-blue"/> 
                            <h3>Ordered Products</h3>
                        </div>
                        <div className="product-list">
                            {order_items.map((item, idx) => {
                                const price = item.product_details.discounted_price || item.product_details.price || 0;
                                return (
                                    <div key={idx} className="od-product-item">
                                        <div className="od-prod-img-box">
                                            <img 
                                                src={item.product_details.image || item.product_details.image_url || "https://via.placeholder.com/80"} 
                                                alt="Product"
                                                onError={(e) => {e.target.src = "https://via.placeholder.com/80"}}
                                            />
                                        </div>
                                        <div className="od-prod-info">
                                            <h4>{item.product_details.title}</h4>
                                            <div className="od-prod-meta">
                                                <span>SKU: {item.product_details.sku}</span>
                                                {item.selected_size && <span> | Size: {item.selected_size}</span>}
                                                {item.selected_color && <span> | Color: {item.selected_color}</span>}
                                            </div>
                                        </div>
                                        <div className="od-prod-pricing">
                                            <div className="qty-badge">Qty: {item.quantity}</div>
                                            <span className="price">PKR {(price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="od-summary">
                            <div className="summary-row">
                                <span>Payment Method</span>
                                <strong><CreditCard size={14}/> {order_details.payment_method}</strong>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount</span>
                                <span>PKR {order_details.total_price.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- RIGHT SIDE: SHIPPING & DISPATCH --- */}
                <div className="od-col-side">
                    
                    {/* SHIPPING INFO */}
                    <motion.div 
                        className="od-card shipping-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="card-header">
                            <MapPin size={20} className="icon-purple"/> 
                            <h3>Shipping Details</h3>
                            <motion.button 
                                className={`copy-address-btn ${isAddressCopied ? 'copied' : ''}`}
                                onClick={handleCopyAddress}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isAddressCopied ? (
                                    <> <CheckCircle size={14}/> Copied! </>
                                ) : (
                                    <> <Copy size={14}/> Copy Info </>
                                )}
                            </motion.button>
                        </div>
                        
                        <div className="customer-info-box">
                            <div className="info-line">
                                <User size={16}/> <strong>{order_details.customer_name}</strong>
                            </div>
                            <div className="info-line">
                                <span className="label">Phone:</span> {order_details.customer_phone}
                            </div>
                            <div className="info-line address">
                                <span className="label">Address:</span>
                                <p>{order_details.customer_address}</p>
                            </div>
                            <div className="info-line">
                                <span className="label">City:</span> {order_details.customer_city}
                            </div>
                        </div>
                    </motion.div>

                    {/* DISPATCH SECTION */}
                    <motion.div 
                        className="od-card dispatch-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="card-header">
                            <Truck size={20} className="icon-green"/> 
                            <h3>Logistics & Dispatch</h3>
                        </div>

                        {status === 'processing' ? (
                            <form onSubmit={handleDispatch} className="dispatch-form">
                                <div className="form-input-group">
                                    <label>Courier Service</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. TCS, Leopards"
                                        value={courierName}
                                        onChange={e => setCourierName(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-input-group">
                                    <label>Tracking Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="Scan or type tracking ID"
                                        value={trackingNumber}
                                        onChange={e => setTrackingNumber(e.target.value)}
                                        required 
                                    />
                                </div>
                                <motion.button 
                                    type="submit" 
                                    className="dispatch-submit-btn"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? 'Dispatching...' : 'Confirm Dispatch'} <Package size={18}/>
                                </motion.button>
                            </form>
                        ) : (
                            <div className="tracking-display">
                                <div className="tracking-row">
                                    <span className="t-label">Courier:</span>
                                    <span className="t-val">{shipment_details.courier_name}</span>
                                </div>
                                <div className="tracking-row">
                                    <span className="t-label">Tracking #:</span>
                                    <span className="t-val highlight">{shipment_details.tracking_number}</span>
                                </div>
                                <div className="dispatch-success-msg">
                                    <CheckCircle size={16}/> Shipment Dispatched
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;