// src/components/OrderCard.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Printer, Eye } from 'lucide-react';

// NOTE: We do NOT import './OrderCard.css' here because 
// the styles are globally available in 'Orders.css' to avoid build errors.

const OrderCard = ({ order }) => {
    const navigate = useNavigate();
    const { order_details, order_items, shipment_details } = order;
    const [copied, setCopied] = useState(false);

    // Get the first item to display as the main thumbnail
    const item = order_items[0];
    const product = item.product_details;

    // Price Logic: Handle potential null values safely
    const unitPrice = product.discounted_price || product.price || 0;
    const totalPrice = unitPrice * item.quantity;

    // --- HANDLERS ---

    const handleCopyId = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(order_details.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrintInvoice = (e) => {
        e.stopPropagation();
        // Pass the full order object to the invoice page via state
        navigate('/orders/invoice', { state: { order: order } });
    };

    const handleViewOrder = (e) => {
        e.stopPropagation();
        // Navigate to the new, beautiful Order Details Page
        navigate(`/orders/${order_details.id}`);
    };

    // --- RENDER ---
    return (
        <div className="sj10-order-card">
            {/* Header: Order ID & Date */}
            <div className="card-header-bar">
                <div className="order-number-group">
                    <span className="label">Order Number:</span>
                    <span className="val">{order_details.id}</span>
                    <button className="copy-icon-btn" onClick={handleCopyId} title="Copy Order ID">
                        {copied ? <span style={{color:'green', fontSize:'12px'}}>Copied</span> : <Copy size={14} />}
                    </button>
                </div>
                <div className="header-date">
                    {new Date(order_details.created_at).toLocaleDateString()}
                </div>
            </div>

            {/* Body: Product Info & Pricing */}
            <div className="card-body-flex">
                <div className="product-thumb">
                    <img 
                        src={product.image || product.image_url || 'https://via.placeholder.com/80'} 
                        alt={product.title} 
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/80'}}
                    />
                </div>
                
                <div className="product-info-col">
                    {/* Tags (e.g., COD) */}
                    <div className="tags-row">
                        {order_details.payment_method === 'COD' && <span className="tag cod">COD</span>}
                    </div>

                    <h4 className="prod-title">{product.title}</h4>
                    <p className="prod-qty">Qty: {item.quantity}</p>
                    
                    {/* Variant Info if available */}
                    <p className="prod-variant">
                        {item.selected_size ? `Size: ${item.selected_size}` : ''}
                        {item.selected_color ? ` | Color: ${item.selected_color}` : ''}
                    </p>
                </div>

                <div className="price-col">
                    <span className="price-total">PKR {totalPrice.toLocaleString()}</span>
                    
                    <div className="print-status-row">
                         {/* Status Badge */}
                         <span className={`status-label status-${shipment_details.current_status}`}>
                             {shipment_details.current_status.replace('_', ' ').toUpperCase()}
                         </span>
                    </div>
                </div>
            </div>

            {/* Footer: Action Buttons */}
            <div className="card-footer-actions">
                <div className="footer-left">
                    {/* Placeholder for future features (e.g. 'Chat with Buyer') */}
                </div>
                <div className="footer-right">
                    <button className="action-btn secondary" onClick={handlePrintInvoice}>
                        <Printer size={14} style={{marginRight:'5px'}}/> Print Invoice
                    </button>
                    
                    <button className="action-btn primary" onClick={handleViewOrder}>
                        <Eye size={14} style={{marginRight:'5px'}}/> View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;