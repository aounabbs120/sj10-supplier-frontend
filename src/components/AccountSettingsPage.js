import React, { useState, useEffect, useCallback, useRef } from 'react';
import supplierService from '../services/supplierService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../pages/AccountPage.css'; // Adjust path as needed, e.g., '../styles/AccountPage.css'

const AccountSettingsSkeleton = () => (
    <div className="account-settings-container">
        <div className="account-header">
            <div className="skeleton-pfp"></div>
            <div className="skeleton-line medium" style={{'width': '150px', 'height': '30px'}}></div>
        </div>
        <div className="form-card">
            <div className="skeleton-grid">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box full-width"></div>
            </div>
        </div>
    </div>
);


const AccountSettingsPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [newProfilePicFile, setNewProfilePicFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
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
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePicClick = () => {
        fileInputRef.current.click();
    };

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
            alert('Profile updated successfully!');
            
            setNewProfilePicFile(null);
            setPreviewUrl('');
            fetchProfile(); // Re-fetch to show final state

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <AccountSettingsSkeleton />;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="account-settings-container">
             <button className="back-button" onClick={() => navigate('/account')}>&larr; Back to Account</button>
            <form onSubmit={handleSubmit}>
                <div className="account-header">
                    <div className="profile-picture-wrapper" onClick={handleProfilePicClick} title="Change Profile Picture">
                        <div className="animated-gradient-border"></div>
                        <img 
                            src={previewUrl || profile?.profile_pic || 'https://via.placeholder.com/150'} 
                            alt="Profile" 
                            className="pfp-image"
                        />
                        <div className="pfp-overlay"><span>✏️</span></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    
                    <div className="supplier-code-container">
                        <span>{profile?.supplier_code || profile?.id}</span>
                        <button type="button" className="copy-btn" onClick={handleCopy}>
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Personal & Brand Details</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>Brand Name <span className="required-star">*</span></label><input type="text" name="brand_name" value={profile?.brand_name || ''} onChange={handleChange} placeholder="e.g., SJ10 Fashions" required /></div>
                        <div className="form-group"><label>Full Name <span className="required-star">*</span></label><input type="text" name="full_name" value={profile?.full_name || ''} onChange={handleChange} placeholder="e.g., John Doe" required /></div>
                        <div className="form-group"><label>Contact Number <span className="required-star">*</span></label><input type="tel" name="contact_number" value={profile?.contact_number || ''} onChange={handleChange} placeholder="e.g., 03001234567" required /></div>
                        <div className="form-group"><label>Email</label><input type="email" value={profile?.email || ''} disabled title="Email cannot be changed" /></div>
                        <div className="form-group"><label>City</label><input type="text" name="city" value={profile?.city || ''} onChange={handleChange} placeholder="e.g., Karachi" /></div>
                        <div className="form-group full-width"><label>Address</label><input type="text" name="address" value={profile?.address || ''} onChange={handleChange} placeholder="e.g., 123 Street, ABC Area" /></div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? <div className="spinner-small"></div> : 'Update Profile'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default AccountSettingsPage;