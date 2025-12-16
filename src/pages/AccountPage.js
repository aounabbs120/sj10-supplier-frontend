// src/pages/AccountPage.js

import React, { useState, useEffect, useCallback } from 'react';
import supplierService from '../services/supplierService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

// --- Verification Badge Component ---
const VerificationBadge = ({ status }) => {
    let icon = '❓';
    let text = 'Unknown';
    let className = 'unverified';

    switch (status) {
        case 'verified':
            icon = '✓';
            text = 'Verified';
            className = 'verified';
            break;
        case 'underreview':
            icon = '⏳';
            text = 'Under Review';
            className = 'under-review';
            break;
        case 'unverified':
            icon = '✖';
            text = 'Unverified';
            className = 'unverified';
            break;
        default:
            icon = '✖';
            text = 'Unverified';
            className = 'unverified';
            break;
    }

    return (
        <div className={`verification-badge ${className}`} title={text}>
            <span className="badge-icon">{icon}</span>
        </div>
    );
};


// --- Skeleton Loader for the UI ---
const AccountSkeleton = () => (
    <div className="account-container">
        <div className="account-header">
            <div className="skeleton-pfp"></div>
            <div className="skeleton-line large" style={{ marginTop: '15px' }}></div>
            <div className="skeleton-line medium"></div>
        </div>
        <div className="account-options-list">
            <div className="skeleton-box-list-item"></div>
            <div className="skeleton-box-list-item"></div>
            <div className="skeleton-box-list-item"></div>
            <div className="skeleton-box-list-item"></div>
        </div>
    </div>
);

const AccountPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        try {
            const data = await supplierService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile. Please refresh the page.');
        } finally {
            setTimeout(() => setLoading(false), 500);
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

    if (loading) {
        return <AccountSkeleton />;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="account-container">
            {/* --- Header Section --- */}
            <div className="account-header">
                <div 
                    className="profile-picture-wrapper-menu" 
                    onClick={() => navigateTo('/account-settings')} 
                    title="Edit Profile"
                >
                    <img 
                        src={profile?.profile_pic || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="pfp-image"
                    />
                    <div className="pfp-overlay"><span>✏️</span></div>
                    <VerificationBadge status={profile?.verified_status} />
                </div>

                <h2 className="brand-name-header">{profile?.brand_name || 'Brand Name'}</h2>
                
                {/* --- THIS IS THE CORRECTED LINE, RESTORING YOUR ORIGINAL LOGIC --- */}
                <p className="seller-id-header">Seller ID: {profile?.supplier_code || profile?.id}</p>
            </div>

            {/* --- Options List: First Group --- */}
            <div className="account-options-list">
                <div className="option-item" onClick={() => navigateTo('/account-settings')}>
                    <span>Account Settings</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
                
                <div className="option-item verification" onClick={() => navigateTo('/verification-center')}>
                    <span>Verification Center</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
                
                <div className="option-item" onClick={() => navigateTo('/sj10-university')}>
                    <span>SJ10 University</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
                <div className="option-item" onClick={() => navigateTo('/feedback')}>
                    <span>Feedback</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
            </div>

            {/* --- Options List: Second Group for policies --- */}
            <div className="account-options-list">
                 <div className="option-item" onClick={() => navigateTo('/shipping-policy')}>
                    <span>Shipping Policy</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
                <div className="option-item" onClick={() => navigateTo('/privacy-policy')}>
                    <span>Privacy Policy</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
                <div className="option-item" onClick={() => navigateTo('/about-us')}>
                    <span>About Us</span>
                    <span className="arrow-icon">&gt;</span>
                </div>
            </div>

            {/* --- Logout Button --- */}
            <div className="form-actions-logout">
                <button className="btn-logout-full" onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
};

export default AccountPage;