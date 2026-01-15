import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Printer, Truck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';
import supplierService from '../services/supplierService';

const OrderCard = ({ order, isAccountLocked, unpaidAmount, isNew }) => {
    const navigate = useNavigate();
    const { order_details, order_items, shipment_details } = order;
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // --- ⚡ FIXED TRACKING LOGIC ---
    const isTrackable = useMemo(() => {
        if (!shipment_details || !shipment_details.current_status) return false;
        
        // 1. Normalize: Convert to lowercase and remove spaces (e.g., "In Transit" -> "intransit")
        const status = shipment_details.current_status.toLowerCase().replace(/\s/g, '');

        // 2. List of statuses where Tracking Button should appear
        const trackableStatuses = [
            'orderdispatched', 
            'intransit', 
            'outfordelivery', 
            'failedattempt', 
            'shipped', 
            'booked', 
            'arrivalatdestination',
            'arrivalatorigin'
        ];

        // 3. Check if status matches any of the above
        if (trackableStatuses.includes(status)) return true;

        // 4. Check Delivered (Allow tracking for 2 days after delivery)
        if (status === 'delivered') {
            const deliveryDate = new Date(shipment_details.updated_at);
            const twoDaysLater = new Date(deliveryDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            return new Date() < twoDaysLater;
        }
        
        // 5. Allow tracking for Returned/ReturnProcessInitiated just in case they want to see history
        if (status.includes('return')) return true;

        return false;
    }, [shipment_details]);

    const mainItem = order_items[0];
    if (!mainItem) return null;

    // Lock card only if status is strictly 'processing' AND account is locked
    const isCardLocked = isAccountLocked && (shipment_details.current_status || '').toLowerCase() === 'processing';
    
    const product = mainItem.product_details || {};
    const finalPrice = order_details.total_price || 0;

    const handleViewDetails = () => {
        if (isNew) {
            supplierService.markOrderAsSeen(order_details.id).catch(console.error);
        }
        navigate(`/orders/${order_details.id}`);
    };

    const handleUnlockClick = (e) => { e.stopPropagation(); setIsPaymentModalOpen(true); };
    const handlePrintInvoice = (e) => { e.stopPropagation(); navigate('/orders/invoice', { state: { order } }); };
    const handleTrackOrder = (e) => { e.stopPropagation(); navigate(`/orders/track/${order_details.id}`); };
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <>
            <motion.div 
                className={`sj10-order-card ${isNew ? 'is-new' : ''}`}
                variants={cardVariants}
                layoutId={`order-${order_details.id}`}
            >
                <div className="card-content-wrapper" onClick={isCardLocked ? null : handleViewDetails}>
                    <div className="card-header-bar">
                        <div className="order-number-group">
                            <span style={{ fontWeight: 600 }}>#{order_details.id.substring(0, 8).toUpperCase()}</span>
                            {isNew && <span className="new-tag">NEW</span>}
                        </div>
                        <span className="date-display">{new Date(order_details.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="card-body-flex">
                        <div className="product-thumb">
                            <img src={product.image || 'https://via.placeholder.com/80'} alt={product.title} />
                        </div>
                        
                        {/* Text Information */}
                        <div className="product-info-col">
                            <h4 className="prod-title">{product.title || 'Product Not Found'}</h4>
                            <p className="prod-qty">Qty: {mainItem.quantity}</p>
                        </div>

                        {/* Status Label */}
                        <div className="status-container">
                             <span className={`status-label status-${(shipment_details.current_status || 'processing').replace(/\s/g, '')}`}>
                                {(shipment_details.current_status || 'Processing').replace(/_/g, ' ')}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="price-col">
                            <span className="price-label">Total</span>
                            <span className="price-total">PKR {finalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div className="card-footer-actions">
                        {/* ⚡ TRACK BUTTON IS NOW VISIBLE FOR IN TRANSIT */}
                        {isTrackable && !isCardLocked && (
                            <button className="action-btn track" onClick={handleTrackOrder}>
                                <Truck size={16}/> Track
                            </button>
                        )}
                        <button className="action-btn secondary" onClick={handlePrintInvoice}>
                            <Printer size={16}/> Print
                        </button>
                        <button className="action-btn primary" onClick={handleViewDetails}>
                            View <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {isCardLocked && (
                    <motion.div 
                        className="locked-card-overlay" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                    >
                        <div className="locked-card-content">
                            <Lock size={20} className="text-red-500" />
                            <span>Locked</span>
                        </div>
                        <button className="unlock-overlay-btn" onClick={handleUnlockClick}>
                            Pay PKR {unpaidAmount.toFixed(0)} to Unlock
                        </button>
                    </motion.div>
                )}
            </motion.div>
            {isPaymentModalOpen && ( <PaymentModal amountDue={unpaidAmount} closeModal={() => setIsPaymentModalOpen(false)} /> )}
        </>
    );
};

export default OrderCard;