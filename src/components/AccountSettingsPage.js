// src/components/AccountSettingsPage.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import supplierService from '../services/supplierService';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop'; // Import the library
import getCroppedImg from '../utils/cropImage'; // Import helper
import './AccountSettingsPage.css';

// --- Skeleton Loader ---
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
                <div className="skeleton-input full-width"></div>
            </div>
        </div>
    </div>
);

const AccountSettingsPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // -- Image Handling States --
    const [newProfilePicFile, setNewProfilePicFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imgError, setImgError] = useState(false);
    
    // -- View Modal State --
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // -- Crop Modal States --
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // 1. User clicks Camera -> Trigger hidden input
    const handleCameraClick = (e) => {
        e.stopPropagation();
        fileInputRef.current.click();
    };

    // 2. User selects file -> Open Crop Modal instead of setting directly
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result); // Set base64 string for cropper
                setIsCropModalOpen(true); // Open Modal
                // Reset input value so same file can be selected again if needed
                fileInputRef.current.value = null; 
            });
            reader.readAsDataURL(file);
        }
    };

    // 3. User moves/zooms -> Store coordinates
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 4. User clicks "Done" in Crop Modal
    const handleCropSave = async () => {
        try {
            const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "profile_cropped.jpg", { type: "image/jpeg" });
            
            // Now we set the file for upload
            setNewProfilePicFile(croppedFile);
            setPreviewUrl(URL.createObjectURL(croppedBlob));
            
            // Close modal
            setIsCropModalOpen(false);
        } catch (e) {
            console.error(e);
            setError("Failed to crop image.");
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
        setIsSuccess(false);

        try {
            let updatedProfileData = { ...profile };

            if (newProfilePicFile) {
                const formData = new FormData();
                formData.append('images', newProfilePicFile);
                const uploadRes = await supplierService.uploadFiles(formData);
                if (uploadRes?.urls?.[0]) {
                    updatedProfileData.profile_pic = uploadRes.urls[0];
                }
            }

            await supplierService.updateMyProfile(updatedProfileData);
            setProfile(updatedProfileData);
            setNewProfilePicFile(null);
            setPreviewUrl('');
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) return <AccountSettingsSkeleton />;
    if (error && !profile) return <p className="error-message">{error}</p>;

    const profileImageSrc = previewUrl || (!imgError && profile?.profile_pic 
        ? profile.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=random&color=fff&size=150`);

    return (
        <div className="account-settings-container">
            <button className="back-button slide-in-down" onClick={() => navigate('/account')}>
                <i className="fas fa-arrow-left"></i> Back to Account
            </button>
            
            <form onSubmit={handleSubmit}>
                {/* HEADER */}
                <div className="settings-header slide-in-down" style={{animationDelay: '0.1s'}}>
                    <div className="pfp-container">
                        <div className="pfp-wrapper" onClick={() => setIsImageModalOpen(true)} title="View Profile Picture">
                            <img src={profileImageSrc} alt="Profile" className="pfp-image" onError={() => setImgError(true)} />
                        </div>
                       <button type="button" className="camera-btn" onClick={handleCameraClick} title="Change Photo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    
                    <div className="supplier-id-wrapper">
                        <span>ID: <strong>{profile?.supplier_code || profile?.id}</strong></span>
                        <button type="button" className={`copy-btn ${isCopied ? 'copied' : ''}`} onClick={handleCopy}>
                            {isCopied ? <><i className="fas fa-check"></i></> : <><i className="far fa-copy"></i></>}
                        </button>
                    </div>
                </div>

                {/* FORM */}
                <div className="settings-card slide-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="card-header">
                        <h3 className="card-title">Profile Details</h3>
                        <p className="card-subtitle">Manage your personal information and brand details.</p>
                    </div>
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
                            <label>Email Address</label>
                            <input type="email" value={profile?.email || ''} disabled className="input-disabled" />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={profile?.city || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" value={profile?.address || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="form-actions slide-in-up" style={{animationDelay: '0.3s'}}>
                    <button type="submit" className={`btn-save ${isSuccess ? 'success' : ''}`} disabled={isSaving}>
                        {isSaving ? <div className="spinner"></div> : isSuccess ? <><i className="fas fa-check"></i> Saved!</> : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* --- 1. FULL SCREEN IMAGE MODAL (WhatsApp Style) --- */}
            {isImageModalOpen && (
                <div className="fullscreen-modal" onClick={() => setIsImageModalOpen(false)}>
                    <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                        <img src={profileImageSrc} alt="Full Screen Profile" />
                        <button className="close-fullscreen" onClick={() => setIsImageModalOpen(false)}>&times;</button>
                    </div>
                </div>
            )}

            {/* --- 2. CROP IMAGE MODAL (TikTok/WhatsApp Style) --- */}
            {isCropModalOpen && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal-container">
                        <div className="crop-modal-header">
                            <h3>Edit Photo</h3>
                            <button onClick={() => setIsCropModalOpen(false)}>&times;</button>
                        </div>
                        <div className="crop-container">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Force 1:1 Aspect Ratio
                                cropShape="round" // Circular Mask
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="crop-controls">
                            <i className="fas fa-minus-circle small-icon"></i>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="zoom-range"
                            />
                            <i className="fas fa-plus-circle small-icon"></i>
                        </div>
                        <div className="crop-actions">
                            <button className="btn-cancel" onClick={() => setIsCropModalOpen(false)}>Cancel</button>
                            <button className="btn-done" onClick={handleCropSave}>Set Profile Photo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettingsPage;