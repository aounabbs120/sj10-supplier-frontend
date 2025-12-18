// src/pages/AccountPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import authService from '../services/authService';
import './AccountPage.css';

// --- Verification Badge Component ---
const VerificationBadge = ({ status }) => {
    let icon = '✖';
    let text = 'Unverified';
    let className = 'unverified';

    if (status === 'verified') {
        icon = '✓';
        text = 'Verified';
        className = 'verified';
    } else if (status === 'underreview') {
        icon = '⏳';
        text = 'Under Review';
        className = 'under-review';
    }

    return (
        <div className={`verification-badge ${className}`} title={text}>
            <span className="badge-icon">{icon}</span>
        </div>
    );
};

// --- Skeleton Loader ---
const AccountSkeleton = () => (
    <div className="account-container">
        <div className="account-header-skeleton pulse">
            <div className="skeleton-circle"></div>
            <div className="skeleton-bar large"></div>
            <div className="skeleton-bar medium"></div>
        </div>
        <div className="account-menu-skeleton">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-row pulse"></div>)}
        </div>
    </div>
);

const AccountPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // State to handle profile image fallback
    const [imgError, setImgError] = useState(false);
    
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        try {
            const data = await supplierService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile. Please refresh the page.');
        } finally {
            // Slight delay to allow animations to feel smooth on fast networks
            setTimeout(() => setLoading(false), 300);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    
    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    if (loading) return <AccountSkeleton />;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    // --- Profile Picture Logic ---
    // 1. Try to use the profile_pic from backend.
    // 2. If it's null OR if imgError is true (onError triggered), use UI Avatars.
    const profileImageSrc = !imgError && profile?.profile_pic 
        ? profile.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=6366f1&color=fff&size=150&bold=true`;

    return (
        <div className="account-container">
            
            {/* --- Hero Profile Card --- */}
            <div className="account-header-card fade-in-down">
                <div className="profile-image-section" onClick={() => navigateTo('/account-settings')}>
                    <div className="image-wrapper">
                        <img 
                            src={profileImageSrc} 
                            alt="Profile" 
                            className="main-pfp" 
                            onError={() => setImgError(true)}
                        />
                        <div className="edit-overlay">✏️</div>
                    </div>
                    <VerificationBadge status={profile?.verified_status} />
                </div>
                
                <div className="profile-info-section">
                    <h2 className="brand-name">{profile?.brand_name || 'Your Brand'}</h2>
                    <h3 className="user-name">{profile?.full_name}</h3>
                    <div className="id-pill">
                        <span className="id-label">Seller ID:</span>
                        <span className="id-value">{profile?.supplier_code || profile?.id}</span>
                    </div>
                </div>
            </div>

            {/* --- Menu Groups with Staggered Animation --- */}
            <div className="menu-group slide-in-up" style={{ animationDelay: '0.1s' }}>
                <h4 className="group-title">Settings & Tools</h4>
                
                <div className="menu-card">
                    <div className="menu-item" onClick={() => navigateTo('/account-settings')}>
                        <span className="menu-icon bg-blue">⚙️</span>
                        <span className="menu-text">Account Settings</span>
                        <span className="menu-arrow">›</span>
                    </div>

                    <div className="menu-item" onClick={() => navigateTo('/verification-center')}>
                        <span className="menu-icon bg-green">🛡️</span>
                        <span className="menu-text">Verification Center</span>
                        {profile?.verified_status !== 'verified' && <span className="notification-dot"></span>}
                        <span className="menu-arrow">›</span>
                    </div>

                    <div className="menu-item" onClick={() => navigateTo('/sj10-university')}>
                        <span className="menu-icon bg-purple">🎓</span>
                        <span className="menu-text">SJ10 University</span>
                        <span className="menu-arrow">›</span>
                    </div>
                    
                    <div className="menu-item" onClick={() => navigateTo('/feedback')}>
                        <span className="menu-icon bg-orange">💬</span>
                        <span className="menu-text">Feedback & Support</span>
                        <span className="menu-arrow">›</span>
                    </div>
                </div>
            </div>

            <div className="menu-group slide-in-up" style={{ animationDelay: '0.2s' }}>
                <h4 className="group-title">Legal & Info</h4>
                
                <div className="menu-card">
                    <div className="menu-item" onClick={() => navigateTo('/shipping-policy')}>
                        <span className="menu-icon bg-gray">🚚</span>
                        <span className="menu-text">Shipping Policy</span>
                        <span className="menu-arrow">›</span>
                    </div>
                    <div className="menu-item" onClick={() => navigateTo('/privacy-policy')}>
                        <span className="menu-icon bg-gray">🔒</span>
                        <span className="menu-text">Privacy Policy</span>
                        <span className="menu-arrow">›</span>
                    </div>
                    <div className="menu-item" onClick={() => navigateTo('/about-us')}>
                        <span className="menu-icon bg-gray">🏢</span>
                        <span className="menu-text">About Us</span>
                        <span className="menu-arrow">›</span>
                    </div>
                </div>
            </div>

            {/* --- Logout Button --- */}
            <div className="logout-section slide-in-up" style={{ animationDelay: '0.3s' }}>
                <button className="btn-logout" onClick={handleLogout}>
                    <span>🚪</span> Log Out
                </button>
            </div>
        </div>
    );
};

export default AccountPage;