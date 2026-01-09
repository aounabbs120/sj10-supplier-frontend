import React, { useState } from 'react';
import { X, UploadCloud, Smartphone, Send, Phone, CheckCircle } from 'lucide-react';
import supplierService from '../services/supplierService';
import './PaymentModal.css';

// 1. Added default value for amountDue to prevent crash
// 2. Added support for 'onClose' OR 'closeModal' prop names
const PaymentModal = ({ amountDue = 0, closeModal, onClose }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Handle different prop names for closing
    const handleCloseFunc = closeModal || onClose;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!screenshot) {
            setError('Please upload a screenshot of your payment receipt.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('amount', amountDue);
            
            await supplierService.submitCommissionProof(formData);
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload proof. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) {
            window.location.reload(); 
        } else {
            if (handleCloseFunc) handleCloseFunc();
        }
    };

    // Safety check for display
    const displayAmount = (amountDue || 0).toFixed(0);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={handleClose}>
                    <X size={20} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="modal-header">
                            <h2>Unlock Account</h2>
                            <p className="sub-text">
                                Pay <span className="amount-highlight">PKR {displayAmount}</span> to clear dues.
                            </p>
                        </div>

                        <div className="accounts-grid">
                            <div className="account-card">
                                <div className="acc-icon-box bg-upaisa"><Smartphone size={20}/></div>
                                <div className="acc-details">
                                    <span className="acc-name">Upaisa</span>
                                    <span className="acc-number">0334 8846378</span>
                                    <span className="acc-title">Azher Mehmood</span>
                                </div>
                            </div>
                            <div className="account-card">
                                <div className="acc-icon-box bg-jazz"><Smartphone size={20}/></div>
                                <div className="acc-details">
                                    <span className="acc-name">JazzCash</span>
                                    <span className="acc-number">0349 5643002</span>
                                    <span className="acc-title">Azher Mehmood</span>
                                </div>
                            </div>
                        </div>

                        <div className="upload-container">
                            <label className="upload-label">Payment Proof</label>
                            <div className="file-drop-zone">
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                {screenshot ? (
                                    <div className="file-selected">
                                        <CheckCircle size={20} color="#059669" />
                                        <span>{screenshot.name.substring(0, 25)}...</span>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <UploadCloud size={32} />
                                        <span className="upload-text">Tap to Upload Screenshot</span>
                                        <span className="upload-sub">Supports JPG, PNG</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && <p className="error-msg">{error}</p>}

                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || !screenshot} 
                            className="submit-proof-btn"
                        >
                            {isSubmitting ? 'Sending...' : <><Send size={18}/> Submit Request</>}
                        </button>
                    </>
                ) : (
                    <div className="success-view">
                        <div className="checkmark-circle">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark-circle-stroke" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <h2>Request Submitted!</h2>
                        <p>
                            Dear Seller, your payment proof has been securely transmitted to the <strong>SJ10 Team</strong>. 
                            <br/><br/>
                            We are currently reviewing your request. Please allow <strong>6 to 12 hours</strong> for verification.
                        </p>
                        <div className="support-link">
                            <Phone size={14} /> Need help? WhatsApp: <strong>0334 8846378</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;