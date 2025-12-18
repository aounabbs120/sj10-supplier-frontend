// src/components/TopHeader.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './TopHeader.css';

const TopHeader = () => {
    const [profile, setProfile] = useState(null);
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch profile once for the header
        const fetchProfile = async () => {
            try {
                const data = await supplierService.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error("Header profile fetch error", error);
            }
        };
        fetchProfile();
    }, []);

    // Fallback Image Logic (Same as Dashboard)
    const profileImageSrc = !imgError && profile?.profile_pic 
        ? profile.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=6366f1&color=fff&size=128`;

    return (
        <header className="global-top-header">
            <div className="header-left">
                {/* Logo GIF as requested */}
                <img src="/logo.gif" alt="SJ10 Logo" className="header-logo" />
                <h2 className="header-title">Supplier Panel</h2>
            </div>

            <div className="header-right">
                <div 
                    className="header-profile-wrapper" 
                    onClick={() => navigate('/account')}
                    title="Go to Account"
                >
                    <span className="header-username">{profile?.full_name?.split(' ')[0]}</span>
                    <img 
                        src={profileImageSrc} 
                        alt="Profile" 
                        className="header-profile-pic" 
                        onError={() => setImgError(true)}
                    />
                </div>
            </div>
        </header>
    );
};

export default TopHeader;