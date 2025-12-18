// src/pages/Reviews.js

import React, { useState, useEffect, useMemo } from 'react';
import supplierService from '../services/supplierService';
import './Reviews.css';

// --- Reusable Star Rating Component (from your existing code) ---
const StarRating = ({ rating }) => (
    <div className="star-rating">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`star-icon ${i < rating ? 'star-filled' : 'star-empty'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ))}
    </div>
);

// --- NEW: Analytics & Statistics Card ---
const StatsCard = ({ stats }) => (
    <div className="stats-card fade-in-down">
        <div className="stats-overview">
            <span className="average-rating-value">{stats.average.toFixed(1)}</span>
            <div className="average-rating-stars">
                <StarRating rating={Math.round(stats.average)} />
                <p>Based on {stats.total} reviews</p>
            </div>
        </div>
        <div className="stats-breakdown">
            {stats.counts.map((count, index) => (
                <div className="breakdown-row" key={index}>
                    <span className="star-label">{5 - index} star</span>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                    </div>
                    <span className="count-label">{count}</span>
                </div>
            )).reverse()}
        </div>
    </div>
);

// --- THIS IS THE UPDATED REVIEW CARD COMPONENT ---
const ReviewCard = ({ review, style }) => {
    // NEW: State for the dummy reply system, self-contained in each card
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submittedReply, setSubmittedReply] = useState(null); // Stores the submitted dummy reply

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return; // Prevent empty replies
        setSubmittedReply(replyText);
        setIsReplying(false); // Close the form
    };

    const handleEditReply = () => {
        setReplyText(submittedReply); // Pre-fill the text area with the old reply
        setSubmittedReply(null);     // Clear the submitted reply to show the form again
        setIsReplying(true);         // Open the form
    };

    const handleDeleteReply = () => {
        setSubmittedReply(null);
    };

    return (
        <div className="review-card" style={style}>
            <div className="review-card-header">
                <img src={review.product_image || 'https://via.placeholder.com/150'} alt={review.product_title} className="product-thumbnail" />
                <div className="product-info">
                    <h3 className="product-title">{review.product_title}</h3>
                    <StarRating rating={review.rating} />
                </div>
            </div>
            
            <div className="review-body">
                <p className="review-comment">"{review.comment}"</p>
                {review.image_url && (
                    <div className="review-image-wrapper">
                        <img src={review.image_url} alt="Customer review" className="review-image" />
                    </div>
                )}
            </div>
            
            <div className="review-footer">
                <div className="reviewer-info">
                    <span className="reviewer-name">{review.reviewer_name || 'Anonymous'}</span>
                    <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                {/* Show reply button only if not currently replying and no reply has been submitted yet */}
                {!isReplying && !submittedReply && (
                    <button className="btn-reply" onClick={() => setIsReplying(true)}>Reply</button>
                )}
            </div>

            {/* --- NEW: DUMMY REPLY LOGIC --- */}
            
            {/* 1. If a reply has been submitted, display it */}
            {submittedReply && (
                <div className="seller-reply">
                    <div className="reply-header">
                        <strong>Your Reply</strong>
                        <div className="reply-actions">
                            <button onClick={handleEditReply}>Edit</button>
                            <button onClick={handleDeleteReply}>Delete</button>
                        </div>
                    </div>
                    <p>{submittedReply}</p>
                </div>
            )}

            {/* 2. If the user is currently replying, show the form */}
            {isReplying && (
                <form className="reply-form" onSubmit={handleReplySubmit}>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your response..."
                        rows="3"
                        autoFocus
                    />
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsReplying(false)}>Cancel</button>
                        <button type="submit" className="btn-submit">Submit Reply</button>
                    </div>
                </form>
            )}
            {/* --- END OF DUMMY REPLY LOGIC --- */}
        </div>
    );
};


const Reviews = ({ setIsLoading }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    // --- State for filtering and sorting ---
    const [activeFilter, setActiveFilter] = useState('All'); // 'All', 5, 4, 3, 2, 1
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest', 'lowest'

    useEffect(() => {
        setIsLoading(true);
        const fetchReviews = async () => {
            try {
                const data = await supplierService.getMyReviews();
                setReviews(data);
                calculateStats(data);
            } catch (err) {
                setError('Could not load your reviews. Please try again later.');
            } finally {
                setTimeout(() => { setIsLoading(false); setPageLoading(false); }, 500);
            }
        };
        fetchReviews();
    }, [setIsLoading]);

    const calculateStats = (data) => {
        if (data.length === 0) {
            setStats({ average: 0, total: 0, counts: [0,0,0,0,0] });
            return;
        }
        const totalRating = data.reduce((acc, r) => acc + r.rating, 0);
        const counts = [0, 0, 0, 0, 0]; // counts[0] = 1-star, counts[4] = 5-star
        data.forEach(r => { if(r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++; });
        setStats({
            average: totalRating / data.length,
            total: data.length,
            counts: counts.reverse() // Reverse to have 5-star at index 0
        });
    };

    const filteredAndSortedReviews = useMemo(() => {
        return reviews
            .filter(review => activeFilter === 'All' || review.rating === activeFilter)
            .sort((a, b) => {
                switch (sortBy) {
                    case 'highest': return b.rating - a.rating;
                    case 'lowest': return a.rating - b.rating;
                    case 'newest':
                    default:
                        return new Date(b.created_at) - new Date(a.created_at);
                }
            });
    }, [reviews, activeFilter, sortBy]);


    if (pageLoading) return null; // Let global loader handle it

    return (
        <div className="reviews-container">
            <header className="reviews-header fade-in-down">
                <h1>Customer Reviews</h1>
                <p>Monitor feedback and engage with your customers.</p>
            </header>
            
            {error && <p className="reviews-error">{error}</p>}
            
            {!error && stats && <StatsCard stats={stats} />}

            {!error && reviews.length > 0 && (
                <div className="controls-wrapper fade-in-down" style={{animationDelay: '0.2s'}}>
                    <div className="filter-pills">
                        {['All', 5, 4, 3, 2, 1].map(filter => (
                            <button 
                                key={filter} 
                                className={`pill ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter === 'All' ? 'All' : `${filter} ★`}
                            </button>
                        ))}
                    </div>
                    <div className="sort-dropdown">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Sort by: Newest</option>
                            <option value="highest">Sort by: Highest Rating</option>
                            <option value="lowest">Sort by: Lowest Rating</option>
                        </select>
                    </div>
                </div>
            )}
            
            {!error && filteredAndSortedReviews.length === 0 ? (
                <div className="no-reviews-card">
                    <span className="no-reviews-icon">📝</span>
                    <h2>No Reviews Match Your Filters</h2>
                    <p>Try selecting a different filter or check back later for new feedback.</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {filteredAndSortedReviews.map((review, index) => (
                        <ReviewCard key={review.id} review={review} style={{ animationDelay: `${index * 100}ms` }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;