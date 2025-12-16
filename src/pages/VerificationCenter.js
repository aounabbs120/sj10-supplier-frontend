// src/pages/VerificationCenter.js

import React, { useState, useEffect, useCallback } from 'react'; // <-- THIS LINE IS NOW FIXED
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './VerificationCenter.css';

// --- Reusable UI Components for different statuses ---

// The success/animation component, now more reusable
const StatusDisplay = ({ status, message, buttonText, buttonLink }) => {
    let icon = '⏳';
    let title = 'Under Review';
    let className = '';

    if (status === 'verified') {
        icon = '✓';
        title = 'You are Verified!';
        className = 'verified';
    } else if (status === 'error') {
        icon = '✖';
        title = 'Submission Failed';
        className = 'error';
    }

    return (
        <div className={`feedback-success ${className}`}>
            <div className={`success-icon ${className}`}>{icon}</div>
            <h2>{title}</h2>
            <p>{message}</p>
            <Link to={buttonLink} className="btn-primary">{buttonText}</Link>
        </div>
    );
};

// The file upload input (no changes)
const FileUploadInput = ({ label, onFileChange, fileName }) => (
    <div className="file-upload-wrapper">
        <label htmlFor={label} className={`file-drop-area ${fileName ? 'has-file' : ''}`}>
            <span className="file-icon">{fileName ? '✓' : '↑'}</span>
            <span className="file-label">{fileName || `Upload ${label}`}</span>
        </label>
        <input id={label} type="file" onChange={onFileChange} accept="image/png, image/jpeg" />
    </div>
);


const VerificationCenter = ({ setIsLoading }) => {
    const [profile, setProfile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    
    const [cnicFront, setCnicFront] = useState(null);
    const [cnicBack, setCnicBack] = useState(null);
    const [bankProof, setBankProof] = useState(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // --- NEW: Fetch the supplier's profile to check their status ---
    const fetchProfile = useCallback(async () => {
        try {
            const data = await supplierService.getMyProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to load profile for verification status.", err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setPageLoading(false);
            }, 500);
        }
    }, [setIsLoading]);

    useEffect(() => {
        setIsLoading(true);
        fetchProfile();
    }, [fetchProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cnicFront || !cnicBack || !bankProof) {
            alert("Please upload all three required documents.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('images', cnicFront);
            formData.append('images', cnicBack);
            formData.append('images', bankProof);
            
            const uploadResponse = await supplierService.uploadFiles(formData);
            const [cnicFrontUrl, cnicBackUrl, bankProofUrl] = uploadResponse.urls;

            await supplierService.submitVerificationDocuments({
                cnicFrontUrl,
                cnicBackUrl,
                bankProofUrl,
            });
            
            // On success, refetch the profile to get the new "underreview" status
            fetchProfile();

        } catch (err) {
            const message = err.response?.data?.message || "An unexpected error occurred. Please try again.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- The Main Render Logic ---
    const renderContent = () => {
        // Use the fetched profile status to decide what to show
        const status = profile?.verified_status;

        switch (status) {
            case 'underreview':
                return (
                    <StatusDisplay 
                        status="underreview"
                        message="Thank you for submitting your documents. Your details are now under review. We will notify you once the process is complete."
                        buttonText="Back to Account"
                        buttonLink="/account"
                    />
                );
            case 'verified':
                return (
                    <StatusDisplay 
                        status="verified"
                        message="Congratulations! Your account is fully verified. Customers will now see a verified badge on your profile, building more trust."
                        buttonText="Back to Account"
                        buttonLink="/account"
                    />
                );
            case 'unverified':
            default: // Also handles null or undefined status
                return (
                    <>
                        <div className="alert-banner verification">
                            <span className="alert-icon">📄</span>
                            <p>
                                <strong>Important:</strong> For successful verification, the name on your CNIC must exactly match the account holder's name on your bank document.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-card verification">
                                <h3>Upload Your Documents</h3>
                                <div className="file-upload-grid">
                                    <FileUploadInput 
                                        label="CNIC Front" 
                                        fileName={cnicFront?.name}
                                        onFileChange={(e) => setCnicFront(e.target.files[0])}
                                    />
                                    <FileUploadInput 
                                        label="CNIC Back" 
                                        fileName={cnicBack?.name}
                                        onFileChange={(e) => setCnicBack(e.target.files[0])}
                                    />
                                    <FileUploadInput 
                                        label="Bank Proof (Screenshot or Cheque)" 
                                        fileName={bankProof?.name}
                                        onFileChange={(e) => setBankProof(e.target.files[0])}
                                    />
                                </div>
                                {errorMessage && <p className="error-message main-error">{errorMessage}</p>}
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                );
        }
    };
    
    if (pageLoading) return null; // Global loader is active

    return (
        <div className="verification-container">
            <div className="static-page-header">
                <h1>Verification Center</h1>
                <Link to="/account" className="back-link">Back to Account</Link>
            </div>
            {renderContent()}
        </div>
    );
};

export default VerificationCenter;