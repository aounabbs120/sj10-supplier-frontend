// src/components/OrderCard.js

import React from 'react';

// Helper to get a color class and icon based on status
const getStatusInfo = (status) => {
    switch (status) {
        case 'processing': 
            return { className: 'status-processing', icon: '⏳', text: 'Processing' };
        case 'tracking_added': 
            return { className: 'status-shipped', icon: '🚚', text: 'Shipped' };
        case 'in_transit': 
            return { className: 'status-shipped', icon: '✈️', text: 'In Transit' };
        case 'delivered': 
            return { className: 'status-delivered', icon: '✅', text: 'Delivered' };
        case 'cancelled': 
            return { className: 'status-cancelled', icon: '❌', text: 'Cancelled' };
        default: 
            return { className: 'status-default', icon: '📦', text: 'Archived' };
    }
};

const OrderCard = ({ order, onSelect, style }) => {
    const { shipment_details, order_details, order_items } = order;
    
    const statusInfo = getStatusInfo(shipment_details.current_status);

    // Get the first item's image as the primary display image
    const primaryImage = order_items?.[0]?.product_details?.image_url || 'https://via.placeholder.com/150';

    // Format the price to PKR
    const formattedPrice = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
    }).format(order_details.total_price);

    return (
        <div className="order-card" onClick={onSelect} style={style}>
            <div className="order-card-image-wrapper">
                <img src={primaryImage} alt="Product" className="order-card-image" />
                <span className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.icon} {statusInfo.text}
                </span>
            </div>

            <div className="order-card-content">
                <div className="order-card-header">
                    <span className="order-id">#{order_details.id.substring(0, 8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order_details.created_at).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="order-card-body">
                    <p className="customer-name">{order_details.customer_name}</p>
                    <p className="item-summary">
                        {order_items.length} item{order_items.length > 1 ? 's' : ''}
                    </p>
                </div>
                <div className="order-card-footer">
                    <span className="order-total-label">Total</span>
                    <span className="order-total">{formattedPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;