// src/pages/Reviews.js

import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService'; // ✅ CORRECT: Use your existing service
import './Reviews.css'; // We will create this CSS file next

// A reusable component to display star ratings visually
const StarRating = ({ rating }) => {
    const totalStars = 5;
    return (
        <div className="star-rating">
            {[...Array(totalStars)].map((_, index) => {
                const starClass = index < rating ? 'star-filled' : 'star-empty';
                return (
                    <svg key={index} className={`star-icon ${starClass}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                );
            })}
        </div>
    );
};

const Reviews = ({ setIsLoading }) => {
    const [reviews, setReviews] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);

        const fetchReviews = async () => {
            try {
                // ✅ CORRECT: Call the function from your supplierService
                const data = await supplierService.getMyReviews();
                setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setError('Could not load your reviews. Please try again later.');
            } finally {
                const timer = setTimeout(() => {
                    setIsLoading(false);
                    setPageLoading(false);
                }, 500);

                return () => clearTimeout(timer);
            }
        };

        fetchReviews();
    }, [setIsLoading]);

    if (pageLoading) {
        return null;
    }

    return (
        <div className="reviews-container">
            <h1 className="reviews-header">Manage Reviews</h1>
            
            {error && <p className="reviews-error">{error}</p>}
            
            {!error && reviews.length === 0 && (
                <div className="no-reviews-card">
                    <span className="no-reviews-icon">📝</span>
                    <h2>No Reviews Yet</h2>
                    <p>When customers review your products, they will appear here.</p>
                </div>
            )}
            
            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div key={review.id} className="review-card" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="review-card-header">
                            <img 
                                src={review.product_image || 'https://via.placeholder.com/150'} 
                                alt={review.product_title} 
                                className="product-thumbnail" 
                            />
                            <div className="product-info">
                                <h3 className="product-title">{review.product_title}</h3>
                                <StarRating rating={review.rating} />
                            </div>
                        </div>
                        <p className="review-comment">"{review.comment}"</p>
                        {review.image_url && (
                            <div className="review-image-wrapper">
                                <img src={review.image_url} alt="Customer review" className="review-image" />
                            </div>
                        )}
                        <div className="review-footer">
                            <span className="reviewer-name">{review.reviewer_name || 'Anonymous'}</span>
                            <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;