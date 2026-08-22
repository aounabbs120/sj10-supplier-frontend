// src/components/OrderCard.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Printer, Truck, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';
import supplierService from '../services/supplierService';

const OrderCard = ({ order, isAccountLocked, unpaidAmount, isNew }) => {
    const navigate = useNavigate();
    const { order_details = {}, order_items = [], shipment_details = {} } = order;
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // 🟢 1. WHATSAPP CONFIRMATION & STATUS RESOLVER
    const isPendingWhatsApp = 
        order_details.confirmation_status === 'pending_whatsapp' || 
        order_details.is_pending_whatsapp === true;

    const cancellationReason = 
        shipment_details.cancellation_reason || 
        order_details.cancellation_reason || 
        null;

    // --- ⚡ TRACKING BUTTON VISIBILITY LOGIC ---
    const isTrackable = useMemo(() => {
        if (!shipment_details || !shipment_details.current_status || isPendingWhatsApp) return false;
        
        const status = shipment_details.current_status.toLowerCase().replace(/\s/g, '');

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

        if (trackableStatuses.includes(status)) return true;

        // Allow tracking for 2 days after delivery
        if (status === 'delivered') {
            const deliveryDate = new Date(shipment_details.updated_at || shipment_details.created_at);
            const twoDaysLater = new Date(deliveryDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            return new Date() < twoDaysLater;
        }
        
        if (status.includes('return')) return true;

        return false;
    }, [shipment_details, isPendingWhatsApp]);

    const mainItem = order_items[0];
    if (!mainItem) return null;

    // Lock card if debt limit reached and order is in processing
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
                className={`sj10-order-card ${isNew ? 'is-new' : ''} ${isPendingWhatsApp ? 'is-pending-wa' : ''}`}
                variants={cardVariants}
                layoutId={`order-${order_details.id}`}
            >
                <div className="card-content-wrapper" onClick={isCardLocked ? null : handleViewDetails}>
                    
                    {/* Header Bar */}
                    <div className="card-header-bar">
                        <div className="order-number-group">
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>
                                #{order_details.id.substring(0, 8).toUpperCase()}
                            </span>
                            {isNew && <span className="new-tag">NEW</span>}
                            {isPendingWhatsApp && (
                                <span className="unconfirmed-badge">
                                    <Clock size={11} /> Awaiting Confirmation
                                </span>
                            )}
                        </div>
                        <span className="date-display">
                            {new Date(order_details.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Body */}
                    <div className="card-body-flex">
                        <div className="product-thumb">
                            <img src={product.image || 'https://via.placeholder.com/80'} alt={product.title} />
                        </div>
                        
                        {/* Text Information */}
                        <div className="product-info-col">
                            <h4 className="prod-title">{product.title || 'Product Not Found'}</h4>
                            <p className="prod-qty">Qty: {mainItem.quantity}</p>
                            
                            {/* Cancellation Reason if present */}
                            {cancellationReason && (
                                <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertCircle size={12} /> Reason: {cancellationReason}
                                </div>
                            )}
                        </div>

                        {/* Status Label */}
                        <div className="status-container">
                            {isPendingWhatsApp ? (
                                <span className="status-label status-pending-wa">
                                    Awaiting WhatsApp Reply
                                </span>
                            ) : (
                                <span className={`status-label status-${(shipment_details.current_status || 'processing').replace(/\s/g, '')}`}>
                                    {(shipment_details.current_status || 'Processing').replace(/_/g, ' ')}
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="price-col">
                            <span className="price-label">Total Bill</span>
                            <span className="price-total">PKR {Number(finalPrice).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="card-footer-actions">
                        {isTrackable && !isCardLocked && (
                            <button className="action-btn track" onClick={handleTrackOrder}>
                                <Truck size={16}/> Track
                            </button>
                        )}
                        
                        <button 
                            className="action-btn secondary" 
                            onClick={handlePrintInvoice}
                            title={isPendingWhatsApp ? "Order is not confirmed yet" : "Print Invoice"}
                        >
                            <Printer size={16}/> Print
                        </button>
                        
                        <button className="action-btn primary" onClick={handleViewDetails}>
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Account Debt Lock Overlay */}
                {isCardLocked && (
                    <motion.div 
                        className="locked-card-overlay" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                    >
                        <div className="locked-card-content">
                            <Lock size={20} className="text-red-500" />
                            <span>Account Restricted</span>
                        </div>
                        <button className="unlock-overlay-btn" onClick={handleUnlockClick}>
                            Pay PKR {unpaidAmount.toFixed(0)} to Unlock
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {isPaymentModalOpen && ( 
                <PaymentModal 
                    amountDue={unpaidAmount} 
                    closeModal={() => setIsPaymentModalOpen(false)} 
                /> 
            )}
        </>
    );
};

export default OrderCard;