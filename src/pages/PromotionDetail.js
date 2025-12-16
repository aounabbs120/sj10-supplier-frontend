// src/pages/PromotionDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './Promotions.css'; // We reuse the same CSS for a consistent look

const PromotionDetail = ({ setIsLoading }) => {
    const { promotionId } = useParams();
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setLoading(true); // Set local loading state as well

        const fetchPromotion = async () => {
            try {
                const data = await supplierService.getPromotionById(promotionId);
                setPromotion(data);
            } catch (err) {
                setError('Failed to load promotion details. It may have expired or does not exist.');
                console.error("Fetch Promotion Detail Error:", err);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                    setLoading(false);
                }, 500);
            }
        };

        fetchPromotion();
    }, [promotionId, setIsLoading]);

    if (loading) return null;

    if (error) {
        return (
            <div className="promotions-container">
                <p className="error-message">{error}</p>
                <Link to="/promotions" className="btn btn-secondary" style={{marginTop: '20px'}}>Back to Promotions</Link>
            </div>
        );
    }
    
    if (!promotion) {
        return (
            <div className="promotions-container">
                <p>No promotion found.</p>
                 <Link to="/promotions" className="btn btn-secondary" style={{marginTop: '20px'}}>Back to Promotions</Link>
            </div>
        );
    }
    
    const imageUrl = JSON.parse(promotion.product_image_urls || '[]')[0] || 'https://via.placeholder.com/300';
    const statusText = (promotion.payment_status || 'Unknown').replace(/_/g, ' ');

    return (
        <div className="promotions-container">
            <div className="page-header">
                <h1 className="main-header">Promotion Details</h1>
                <Link to="/promotions" className="btn btn-secondary">Back to List</Link>
            </div>

            <div className="detail-card">
                <div className="detail-image-wrapper">
                    <img src={imageUrl} alt={promotion.product_title} />
                </div>
                <div className="detail-content">
                    <h2>{promotion.product_title}</h2>
                    
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className="detail-value status">{statusText}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Price Paid</span>
                            <span className="detail-value price">PKR {promotion.price_paid}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Start Date</span>
                            <span className="detail-value">{new Date(promotion.start_date).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">End Date</span>
                            <span className="detail-value">{new Date(promotion.end_date).toLocaleDateString('en-GB')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionDetail;