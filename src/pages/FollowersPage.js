/* src/pages/FollowersPage.js */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './FollowersPage.css';

// --- Image Preview Modal ---
const ImageModal = ({ src, onClose }) => {
    if (!src) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt="Full View" />
            </div>
            <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
    );
};

// --- Shimmer Loading Skeleton ---
const FollowerSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-avatar shimmer-bg"></div>
        <div className="skeleton-info">
            <div className="skeleton-line-long shimmer-bg"></div>
            <div className="skeleton-line-short shimmer-bg"></div>
        </div>
    </div>
);

// --- Individual Follower Item ---
const FollowerItem = ({ follower, onViewImage }) => {
    const [imgError, setImgError] = useState(false);
    
    // Generate fallback avatar if image fails or is missing
    const avatarSrc = !imgError && follower.profile_pic
        ? follower.profile_pic
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.full_name || 'U')}&background=random&color=fff&bold=true&size=128`;

    // Format Date nicely (e.g., "Oct 12, 2024")
    const formattedDate = follower.followed_at 
        ? new Date(follower.followed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recently';

    return (
        <div className="follower-card">
            <div className="avatar-wrapper" onClick={() => onViewImage(avatarSrc)}>
                <img 
                    src={avatarSrc} 
                    alt={follower.full_name} 
                    className="follower-avatar"
                    onError={() => setImgError(true)}
                />
            </div>
            <div className="follower-details">
                <span className="follower-name-text">{follower.full_name || "Unknown User"}</span>
                <span className="follower-date-text">
                    <span>📅</span> Followed on {formattedDate}
                </span>
            </div>
        </div>
    );
};

// --- Main Component ---
const FollowersPage = () => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingImage, setViewingImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    const CACHE_KEY = 'sj10_followers_cache';

    const fetchFollowers = useCallback(async () => {
        // 1. FAST LOAD: Check Cache First
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        
        if (cachedData) {
            console.log("⚡ Loaded followers from cache");
            setFollowers(JSON.parse(cachedData));
            setLoading(false); // Stop loading immediately if cache exists
        }

        // 2. NETWORK SYNC: Fetch fresh data in background
        try {
            const serverData = await supplierService.getMyFollowers();
            
            // 3. SMART UPDATE: Only update state if data is different
            if (!cachedData || JSON.stringify(serverData) !== cachedData) {
                console.log("🔄 Updating followers from server...");
                setFollowers(serverData);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(serverData));
            }
        } catch (err) {
            console.error("Follower Fetch Error:", err);
            // Only show UI error if we have NO data (cache failed + network failed)
            if (!cachedData) {
                setError('Unable to load followers at this time.');
            }
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
            {/* Modal for viewing profile pictures */}
            <ImageModal src={viewingImage} onClose={() => setViewingImage(null)} />

            <div className="followers-page-container">
                {/* Sticky Glass Header */}
                <header className="followers-header-glass">
                    <div className="header-left">
                        <button className="back-btn-modern" onClick={() => navigate(-1)}>
                            ‹
                        </button>
                        <h1 className="header-title">Your Followers</h1>
                    </div>
                    {/* Only show count if not loading initially */}
                    {!loading && <div className="count-badge-modern">{followers.length}</div>}
                </header>

                <div className="followers-list-wrapper">
                    {/* LOADING STATE: Show 6 Shimmer Skeletons */}
                    {loading && (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((i) => <FollowerSkeleton key={i} />)}
                        </>
                    )}

                    {/* ERROR STATE */}
                    {!loading && error && (
                        <div className="empty-view">
                            <span className="empty-icon-large">⚠️</span>
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()} style={{marginTop: 10, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#e5e7eb', cursor: 'pointer'}}>Retry</button>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && followers.length === 0 && (
                        <div className="empty-view">
                            <div className="empty-icon-large">👥</div>
                            <h3>No Followers Yet</h3>
                            <p>Share your store link to start building your community!</p>
                        </div>
                    )}

                    {/* DATA LIST */}
                    {followers.map((follower) => (
                        <FollowerItem 
                            key={follower.id} 
                            follower={follower} 
                            onViewImage={setViewingImage} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default FollowersPage;