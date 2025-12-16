// src/components/PromotionCardMobile.js

import React from 'react';
import { Link } from 'react-router-dom';

// We receive the same render function and onPayNow handler from the parent
const PromotionCardMobile = ({ promotion, renderStatus, onPayNow }) => {
    const { id, product_image_urls, product_title, end_date, payment_status } = promotion;
    const imageUrl = JSON.parse(product_image_urls || '[]')[0] || 'https://via.placeholder.com/100';

    return (
        <div className="mobile-promo-card">
            <div className="mobile-card-header">
                <img src={imageUrl} alt={product_title} />
                <div className="mobile-card-title">
                    <h4>{product_title}</h4>
                    {renderStatus(payment_status)}
                </div>
            </div>
            <div className="mobile-card-body">
                <div className="mobile-card-row">
                    <strong>End Date:</strong>
                    <span>{new Date(end_date).toLocaleDateString()}</span>
                </div>
                <div className="mobile-card-row actions">
                    {/* --- CORRECTED "Pay Now" LOGIC --- */}
                    {payment_status === 'approved_awaiting_payment' && (
                        <button className="btn btn-success" onClick={onPayNow}>
                            Pay Now
                        </button>
                    )}
                    <Link to={`/promotions/${id}`} className="btn btn-secondary">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PromotionCardMobile;