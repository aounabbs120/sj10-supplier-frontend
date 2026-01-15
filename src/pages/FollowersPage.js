// src/pages/FollowersPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './FollowersPage.css';

// --- Modal for Viewing Profile Picture ---
const ImageModal = ({ src, onClose }) => {
    if (!src) return null;
    return (
        <div className="image-modal-backdrop" onClick={onClose}>
            <div className="image-modal-content">
                <img src={src} alt="Full view" />
            </div>
            <button className="close-modal-button" onClick={onClose}>&times;</button>
        </div>
    );
};

// --- Follower Item ---
const FollowerItem = ({ follower, onViewImage }) => {
    const [imgError, setImgError] = useState(false);

    // Fallback logic
    const profileImageSrc = !imgError && follower.profile_pic
        ? follower.profile_pic
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.full_name || 'U')}&background=random&color=fff&bold=true&size=128`;

    // Date formatting
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options).replace(/,/, '/');
    };

    return (
        <div className="follower-item fade-in-item">
            <div className="pfp-container-animated" onClick={() => onViewImage(profileImageSrc)}>
                {/* Pseudo-element for border handled in CSS */}
                <img 
                    src={profileImageSrc} 
                    alt={follower.full_name} 
                    className="follower-pfp"
                    onError={() => setImgError(true)}
                />
            </div>
            <div className="follower-info">
                <span className="follower-name">{follower.full_name}</span>
                <span className="follow-date">Followed on {formatDate(follower.followed_at)}</span>
            </div>
        </div>
    );
};

// Skeleton loader
const FollowersSkeleton = () => (
    <div className="followers-list-container">
        {Array(8).fill(0).map((_, i) => (
            <div key={i} className="follower-item-skeleton">
                <div className="skeleton-pfp-circle"></div>
                <div className="skeleton-text-group">
                    <div className="skeleton-name-bar"></div>
                    <div className="skeleton-date-bar"></div>
                </div>
            </div>
        ))}
    </div>
);

const FollowersPage = () => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewingImage, setViewingImage] = useState(null);
    const navigate = useNavigate();
    
    // To prevent double-fetching in StrictMode
    const hasFetched = useRef(false);

    const fetchFollowers = useCallback(async () => {
        // 1. Check Session Storage (Instant Load)
        const cached = sessionStorage.getItem('my_followers_list');
        if (cached) {
            setFollowers(JSON.parse(cached));
            setLoading(false); 
            // We continue to fetch in background to update data
        }

        try {
            const data = await supplierService.getMyFollowers();
            
            // 2. Only update state if data changed (Deep comparison simple check)
            if (JSON.stringify(data) !== cached) {
                setFollowers(data);
                sessionStorage.setItem('my_followers_list', JSON.stringify(data));
            }
        } catch (err) {
            console.error("Follower Fetch Error:", err);
            // Only show error if we have no cached data
            if (!cached) setError('Could not load your followers. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchFollowers();
        }
    }, [fetchFollowers]);

    return (
        <>
            <ImageModal src={viewingImage} onClose={() => setViewingImage(null)} />
            <div className="followers-page-container">
                <div className="followers-header">
                    <button onClick={() => navigate(-1)} className="back-button">‹</button>
                    <h1>Your Followers</h1>
                    <div className="count-badge">{followers.length}</div>
                </div>

                {loading && followers.length === 0 && <FollowersSkeleton />}
                {error && followers.length === 0 && <p className="error-message">{error}</p>}
                
                {!loading && !error && followers.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No Followers Yet</h3>
                        <p>Share your products to start building your community!</p>
                    </div>
                )}

                {followers.length > 0 && (
                    <div className="followers-list-container">
                        {followers.map(follower => (
                            <FollowerItem key={follower.id} follower={follower} onViewImage={setViewingImage} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default FollowersPage;