// src/components/PromotionPaymentModal.js
import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, ShieldCheck, Copy, Banknote } from 'lucide-react';
import supplierService from '../services/supplierService';
import './PromotionPaymentModal.css';

const PromotionPaymentModal = ({ promotion, fixedAmount, onClose }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // For image preview
    const [amountToPay, setAmountToPay] = useState(fixedAmount || 0);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (fixedAmount && fixedAmount > 0) {
            setAmountToPay(fixedAmount);
        } else if (promotion) {
            const detected = parseFloat(promotion.price_paid || promotion.price || 0);
            setAmountToPay(detected);
        }
    }, [fixedAmount, promotion]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            // Create a temporary URL to show the image instantly
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: You could show a tiny toast here "Copied!"
    };

    const handleSubmit = async () => {
        if (!screenshot) return setError('Transaction proof is required.');
        if (amountToPay <= 0) return setError('Invalid amount.');

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('amount', amountToPay);
            formData.append('promotionId', promotion.id); 

            await supplierService.submitPromotionProof(formData);
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Submission failed. Please check your internet connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!promotion) return null;

    return (
        <div className="promo-modal-overlay">
            <div className="promo-modal-content">
                
                {/* --- HEADER --- */}
                <div className="pm-header">
                    <button className="pm-close-btn" onClick={onClose}><X size={20} /></button>
                    <div className="pm-secure-badge">
                        <ShieldCheck size={14} /> Secure Payment Gateway
                    </div>
                    <h2>Activate Campaign</h2>
                    <div className="pm-amount-display">
                        <span className="pm-currency">PKR</span>
                        {amountToPay > 0 ? amountToPay.toLocaleString() : '---'}
                    </div>
                </div>

                {!isSuccess ? (
                    /* --- UPLOAD FORM --- */
                    <div className="pm-body">
                        <p className="pm-instruction">
                            Please transfer the total amount to one of the verified accounts below and upload the transaction receipt.
                        </p>

                        <div className="pm-accounts">
                            {/* JazzCash Card */}
                            <div className="pm-account-card">
                                <div className="pm-bank-info">
                                    <span className="pm-bank-name">JazzCash / Mobilink</span>
                                    <span className="pm-bank-number">0349 5643002</span>
                                    <span style={{fontSize:'0.75rem', color:'#94a3b8'}}>Title: Azher Mehmood</span>
                                </div>
                                <button className="btn-copy" onClick={() => copyToClipboard('03495643002')}>
                                    <Copy size={18} />
                                </button>
                            </div>

                            {/* Upaisa Card */}
                            <div className="pm-account-card">
                                <div className="pm-bank-info">
                                    <span className="pm-bank-name">Upaisa / Ufone</span>
                                    <span className="pm-bank-number">0334 8846378</span>
                                    <span style={{fontSize:'0.75rem', color:'#94a3b8'}}>Title: Azher Mehmood</span>
                                </div>
                                <button className="btn-copy" onClick={() => copyToClipboard('03348846378')}>
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Upload Area with Preview */}
                        <div className="pm-upload-wrapper">
                            <div className={`pm-upload-box ${previewUrl ? 'has-image' : ''}`}>
                                <input type="file" accept="image/*" className="pm-file-input" onChange={handleFileChange} />
                                
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="pm-preview-img" />
                                        <div className="pm-reupload-overlay">Tap to change image</div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} color="#6366f1" style={{marginBottom:'10px'}} />
                                        <div className="pm-upload-text">Upload Transaction Proof</div>
                                        <div className="pm-upload-sub">Supports: JPG, PNG, Screenshots</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && <p style={{color:'#ef4444', textAlign:'center', marginTop:'15px', fontSize:'0.9rem'}}>{error}</p>}

                        <button className="pm-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                'Verifying...'
                            ) : (
                                <>
                                    <Banknote size={20} /> Confirm Payment
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    /* --- SUCCESS CONFIRMATION --- */
                    <div className="pm-success-view">
                        <CheckCircle size={80} color="#10b981" style={{margin:'0 auto'}} strokeWidth={1.5} />
                        <h2 className="pm-success-title">Payment Submitted!</h2>
                        <p className="pm-success-desc">
                            Your transaction proof has been securely received. 
                            <br/><br/>
                            Our financial team is reviewing your request. Your campaign for <strong>{promotion.product_title}</strong> will automatically go live upon verification (approx. 6-12 hours).
                        </p>
                        <button className="pm-submit-btn" onClick={() => window.location.reload()}>
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionPaymentModal;