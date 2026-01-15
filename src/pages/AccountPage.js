import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import authService from '../services/authService';
import { formatCount } from '../utils/formatCount';
import './AccountPage.css';

// --- Star Rating Sub-Component ---
const StarRating = ({ rating }) => {
    const totalStars = 5;
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const halfStar = numRating % 1 >= 0.5;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="star-rating">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star-icon star-full">⭐</span>)}
            {halfStar && <span key="half" className="star-icon star-full">🌟</span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star-icon star-empty">⭐</span>)}
        </div>
    );
};

// --- Verification Badge Component ---
const VerificationBadge = ({ status }) => {
    let icon = '✖'; let text = 'Unverified'; let className = 'unverified';
    if (status === 'verified') { icon = '✓'; text = 'Verified'; className = 'verified'; } 
    else if (status === 'underreview') { icon = '⏳'; text = 'Under Review'; className = 'under-review'; }
    return <div className={`verification-badge ${className}`} title={text}><span className="badge-icon">{icon}</span></div>;
};

// --- Skeleton Loader ---
const AccountSkeleton = () => (
    <div className="account-container">
        <div className="account-header-card pulse">
            <div className="skeleton-circle"></div>
            <div className="skeleton-bar large"></div>
            <div className="skeleton-bar medium"></div>
            <div className="stats-bar-skeleton">
                <div className="stat-item-skeleton"></div>
                <div className="stat-item-skeleton"></div>
                <div className="stat-item-skeleton"></div>
            </div>
        </div>
        <div className="account-menu-skeleton">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-row pulse"></div>)}
        </div>
    </div>
);

const AccountPage = () => {
    const [profile, setProfile] = useState(null);
    const [deliveredCount, setDeliveredCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imgError, setImgError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        // 1. INSTANTLY LOAD FROM CACHE (Speed)
        const cachedProfile = sessionStorage.getItem('sj10_supplier_profile');
        const cachedDelivered = sessionStorage.getItem('sj10_supplier_delivered');

        if (cachedProfile && cachedDelivered) {
            setProfile(JSON.parse(cachedProfile));
            setDeliveredCount(parseInt(cachedDelivered));
            setLoading(false); // Show UI immediately
        }

        // 2. FETCH FRESH DATA FROM SERVER (Accuracy)
        // We do NOT return here anymore. We always check the server.
        try {
            const [profileData, ordersData] = await Promise.all([
                supplierService.getMyProfile(),
                supplierService.getMyOrders().catch(() => [])
            ]);
            
            const delivered = ordersData.filter(order => order.shipment_details.current_status === 'Delivered').length;
            
            // 3. CHECK IF DATA CHANGED
            const isProfileDifferent = JSON.stringify(profileData) !== cachedProfile;
            const isDeliveredDifferent = delivered.toString() !== cachedDelivered;

            // 4. UPDATE UI & CACHE ONLY IF DATA IS NEW
            if (isProfileDifferent || isDeliveredDifferent) {
                console.log("⚡ New data found, updating UI...");
                setProfile(profileData);
                setDeliveredCount(delivered);
                
                // Update Cache
                sessionStorage.setItem('sj10_supplier_profile', JSON.stringify(profileData));
                sessionStorage.setItem('sj10_supplier_delivered', delivered.toString());
            }

        } catch (err) {
            console.error("Background Fetch Error:", err);
            // Only show error screen if we have NO data at all
            if (!cachedProfile) {
                setError('Failed to load profile. Please refresh the page.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchData(); 
        }
    }, [fetchData]);
    
    const handleLogout = () => { 
        sessionStorage.removeItem('sj10_supplier_profile');
        sessionStorage.removeItem('sj10_supplier_delivered');
        authService.logout(); 
        navigate('/login'); 
    };

    const navigateTo = (path) => navigate(path);

    const handleCopyId = (e) => {
        e.stopPropagation();
        const idToCopy = profile?.supplier_code || profile?.id;
        if (!idToCopy) return;
        navigator.clipboard.writeText(idToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    if (loading) return <AccountSkeleton />;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    const profileImageSrc = !imgError && profile?.profile_pic 
        ? profile.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'S')}&background=6366f1&color=fff&size=150&bold=true`;

    return (
        <div className="account-container">
            <div className="account-header-card fade-in-down">
                <div className="profile-image-section" onClick={() => navigateTo('/account-settings')}>
                    <div className="image-wrapper"><img src={profileImageSrc} alt="Profile" className="main-pfp" onError={() => setImgError(true)} /><div className="edit-overlay">✏️</div></div>
                    <VerificationBadge status={profile?.verified_status} />
                </div>
                
                <div className="profile-info-section">
                    <h2 className="brand-name">{profile?.brand_name || 'Your Brand'}</h2>
                    <h3 className="user-name">{profile?.full_name}</h3>
                    <div className="id-pill">
                        <span className="id-label">Seller ID:</span>
                        <span className="id-value">{profile?.supplier_code || profile?.id}</span>
                        <button className="copy-button" onClick={handleCopyId} title="Copy ID">
                            {isCopied ? '✅' : '📋'}
                        </button>
                    </div>
                </div>

                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-label">Reviews ({formatCount(profile?.total_reviews || 0)})</span>
                        <div className="stat-value star-value">
                            <StarRating rating={profile?.average_rating} />
                        </div>
                    </div>
                    {/* FOLLOWERS COUNT WILL NOW UPDATE AUTOMATICALLY */}
                    <div className="stat-item">
                         <span className="stat-label">Followers</span>
                        <span className="stat-value">{formatCount(profile?.followers_count || 0)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Delivered</span>
                        <div className="stat-value icon-value">
                           <span className="check-mark">✓</span>
                           <span className="count-text">{formatCount(deliveredCount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Groups */}
            <div className="menu-group slide-in-up" style={{ animationDelay: '0.1s' }}>
                <h4 className="group-title">My Business</h4>
                <div className="menu-card">
                    <div className="menu-item" onClick={() => navigateTo('/followers')}>
                        <span className="menu-icon bg-blue">👥</span>
                        <span className="menu-text">Your Followers</span>
                        <span className="menu-arrow">›</span>
                    </div>
                    <div className="menu-item" onClick={() => navigateTo('/verification-center')}>
                        <span className="menu-icon bg-green">🛡️</span>
                        <span className="menu-text">Verification Center</span>
                        {profile?.verified_status !== 'verified' && <span className="notification-dot"></span>}
                        <span className="menu-arrow">›</span>
                    </div>
                </div>
            </div>

            <div className="menu-group slide-in-up" style={{ animationDelay: '0.2s' }}>
                <h4 className="group-title">Settings & Support</h4>
                <div className="menu-card">
                    <div className="menu-item" onClick={() => navigateTo('/account-settings')}><span className="menu-icon bg-gray">⚙️</span><span className="menu-text">Account Settings</span><span className="menu-arrow">›</span></div>
                    <div className="menu-item" onClick={() => navigateTo('/sj10-university')}><span className="menu-icon bg-purple">🎓</span><span className="menu-text">SJ10 University</span><span className="menu-arrow">›</span></div>
                    <div className="menu-item" onClick={() => navigateTo('/feedback')}><span className="menu-icon bg-orange">💬</span><span className="menu-text">Feedback & Support</span><span className="menu-arrow">›</span></div>
                </div>
            </div>
            
            <div className="menu-group slide-in-up" style={{ animationDelay: '0.3s' }}>
                <h4 className="group-title">Legal & Info</h4>
                <div className="menu-card">
                    <div className="menu-item" onClick={() => navigateTo('/shipping-policy')}><span className="menu-icon bg-gray">🚚</span><span className="menu-text">Shipping Policy</span><span className="menu-arrow">›</span></div>
                    <div className="menu-item" onClick={() => navigateTo('/privacy-policy')}><span className="menu-icon bg-gray">🔒</span><span className="menu-text">Privacy Policy</span><span className="menu-arrow">›</span></div>
                    <div className="menu-item" onClick={() => navigateTo('/about-us')}><span className="menu-icon bg-gray">🏢</span><span className="menu-text">About Us</span><span className="menu-arrow">›</span></div>
                </div>
            </div>

            <div className="logout-section slide-in-up" style={{ animationDelay: '0.4s' }}>
                <button className="btn-logout" onClick={handleLogout}><span>🚪</span> Log Out</button>
            </div>
        </div>
    );
};

export default AccountPage;