// src/components/AccountSettingsPage.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import supplierService from '../services/supplierService';
import { useNavigate } from 'react-router-dom';
import './AccountSettingsPage.css'; // We will create this new CSS file

// --- NEW Skeleton Loader ---
const AccountSettingsSkeleton = () => (
    <div className="account-settings-container skeleton">
        <div className="settings-header">
            <div className="skeleton-pfp-large pulse"></div>
            <div className="skeleton-bar-title pulse"></div>
        </div>
        <div className="settings-card pulse">
            <div className="skeleton-grid">
                <div className="skeleton-input"></div>
                <div className="skeleton-input"></div>
                <div className="skeleton-input"></div>
                <div className="skeleton-input"></div>
                <div className="skeleton-input"></div>
                <div className="skeleton-input full-width"></div>
            </div>
        </div>
    </div>
);

const AccountSettingsPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    
    // States for image handling
    const [newProfilePicFile, setNewProfilePicFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imgError, setImgError] = useState(false);

    // States for UI feedback
    const [isCopied, setIsCopied] = useState(false);
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile. Please refresh the page.');
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePicClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePicFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCopy = () => {
        const codeToCopy = profile?.supplier_code || profile?.id;
        navigator.clipboard.writeText(codeToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            let updatedProfileData = { ...profile };

            if (newProfilePicFile) {
                const formData = new FormData();
                formData.append('images', newProfilePicFile);
                const uploadRes = await supplierService.uploadFiles(formData);
                updatedProfileData.profile_pic = uploadRes.urls[0];
            }

            await supplierService.updateMyProfile(updatedProfileData);
            
            // Show a success message visually instead of alert
            const saveButton = e.target.querySelector('.btn-save');
            saveButton.innerText = 'Saved!';
            saveButton.classList.add('success');

            setNewProfilePicFile(null);
            setPreviewUrl('');
            
            setTimeout(() => {
                saveButton.innerText = 'Save Changes';
                saveButton.classList.remove('success');
                fetchProfile(); // Re-fetch to show final state
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) return <AccountSettingsSkeleton />;
    if (error && !profile) return <p className="error-message">{error}</p>;

    // --- Robust Profile Picture Logic ---
    const profileImageSrc = previewUrl || (!imgError && profile?.profile_pic 
        ? profile.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=random&color=fff&size=150`);

    return (
        <div className="account-settings-container">
            <button className="back-button slide-in-down" onClick={() => navigate('/account')}>
                ← Back to Account
            </button>
            
            <form onSubmit={handleSubmit}>
                {/* --- HEADER SECTION --- */}
                <div className="settings-header slide-in-down" style={{animationDelay: '0.1s'}}>
                    <div className="pfp-wrapper" onClick={handleProfilePicClick} title="Change Profile Picture">
                        <img 
                            src={profileImageSrc} 
                            alt="Profile" 
                            className="pfp-image"
                            onError={() => setImgError(true)}
                        />
                        <div className="pfp-overlay"><span>✏️</span></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    
                    <div className="supplier-id-wrapper">
                        <span>ID: {profile?.supplier_code || profile?.id}</span>
                        <button type="button" className={`copy-btn ${isCopied ? 'copied' : ''}`} onClick={handleCopy}>
                            {isCopied ? '✓ Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* --- MAIN FORM CARD --- */}
                <div className="settings-card slide-in-up" style={{animationDelay: '0.2s'}}>
                    <h3 className="card-title">Personal & Brand Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Brand Name <span className="required-star">*</span></label>
                            <input type="text" name="brand_name" value={profile?.brand_name || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Full Name <span className="required-star">*</span></label>
                            <input type="text" name="full_name" value={profile?.full_name || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Contact Number <span className="required-star">*</span></label>
                            <input type="tel" name="contact_number" value={profile?.contact_number || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={profile?.email || ''} disabled title="Email cannot be changed" />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={profile?.city || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <input type="text" name="address" value={profile?.address || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="form-actions slide-in-up" style={{animationDelay: '0.3s'}}>
                    {error && <p className="form-error-msg">{error}</p>}
                    <button type="submit" className="btn-save" disabled={isSaving}>
                        {isSaving ? <div className="spinner"></div> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountSettingsPage;