// src/components/OrderDetailModal.js

import React, { useState } from 'react';
import supplierService from '../services/supplierService';

const AddTrackingForm = ({ shipment, onUpdate, onClose }) => {
    // ... (This component has no changes)
    const [trackingNumber, setTrackingNumber] = useState('');
    const [courierName, setCourierName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!trackingNumber || !courierName) {
            setFormError('Both fields are required.');
            return;
        }
        setIsSubmitting(true);
        setFormError('');

        try {
            await supplierService.addTrackingToShipment(shipment.id, {
                tracking_number: trackingNumber,
                courier_name: courierName,
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to add tracking:", error);
            setFormError(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tracking-form">
            <h4 className="form-title">Dispatch Shipment</h4>
            <div className="form-group">
                <label htmlFor="trackingNumber">Tracking Number</label>
                <input
                    id="trackingNumber"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g., 1Z9999W99999999999"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="courierName">Courier Name</label>
                <input
                    id="courierName"
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g., FedEx, Leopards"
                    required
                />
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm Dispatch'}
            </button>
        </form>
    );
};


const OrderDetailModal = ({ order, onClose, onUpdate }) => {
    const { shipment_details, order_details, order_items } = order;
    
    // --- FEATURE: State for the "Copy" button ---
    const [isCopied, setIsCopied] = useState(false);

    // --- FEATURE: Function to handle copying address ---
    const handleCopyAddress = () => {
        const addressText = `Name: ${order_details.customer_name}\nPhone: ${order_details.customer_phone}\nAddress: ${order_details.customer_address}\nCity: ${order_details.customer_city}`;
        navigator.clipboard.writeText(addressText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2>Order Details</h2>
                    <span className="modal-order-id">#{order_details.id.substring(0, 18)}...</span>
                </div>

                <div className="modal-section">
                    <div className="section-header">
                        <h4>Shipping Address</h4>
                        {/* --- FEATURE: The new "Copy" button --- */}
                        <button className={`copy-btn ${isCopied ? 'copied' : ''}`} onClick={handleCopyAddress}>
                            {isCopied ? 'Copied!' : 'Copy Details'}
                        </button>
                    </div>
                    {/* --- FIX 1: Displaying the correct, flat address fields --- */}
                    <p><strong>Name:</strong> {order_details.customer_name}</p>
                    <p><strong>Phone:</strong> {order_details.customer_phone}</p>
                    <p><strong>Address:</strong> {order_details.customer_address}</p>
                    <p><strong>City:</strong> {order_details.customer_city}</p>
                </div>
                
                <div className="modal-section">
                    <h4>Items in Your Shipment</h4>
                    <ul className="item-list">
                        {order_items.map(item => (
                            <li key={item.id} className="item-row">
                                <img src={item.product_details?.image_url || 'https://via.placeholder.com/50'} alt={item.product_details.title} className="item-img" />
                                <div className="item-info">
                                    <span className="item-title">{item.product_details.title}</span>
                                    <span className="item-sku">SKU: {item.product_details.sku || 'N/A'}</span>
                                </div>
                                <span className="item-quantity">Qty: {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* --- FIX 2: Correctly checking for 'processing' status --- */}
                {shipment_details.current_status === 'processing' && (
                    <div className="modal-section form-section">
                        <AddTrackingForm shipment={shipment_details} onUpdate={onUpdate} onClose={onClose} />
                    </div>
                )}

                {shipment_details.tracking_number && (
                    <div className="modal-section">
                        <h4>Tracking Information</h4>
                        <p><strong>Courier:</strong> {shipment_details.courier_name}</p>
                        <p><strong>Tracking #:</strong> {shipment_details.tracking_number}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;