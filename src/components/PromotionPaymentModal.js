import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, CreditCard } from 'lucide-react';
import supplierService from '../services/supplierService';
import './PromotionPaymentModal.css';

// Added 'fixedAmount' prop to receive the exact price from the parent
const PromotionPaymentModal = ({ promotion, fixedAmount, onClose }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Initialize price with fixedAmount if available, otherwise 0
    const [amountToPay, setAmountToPay] = useState(fixedAmount || 0);

    // If fixedAmount changes (or wasn't passed initially), update state
    useEffect(() => {
        if (fixedAmount && fixedAmount > 0) {
            setAmountToPay(fixedAmount);
        } else if (promotion) {
            // Fallback: Try to find price inside promotion object if fixedAmount wasn't passed
            const detected = parseFloat(
                promotion.price || 
                promotion.amount || 
                promotion.cost || 
                (promotion.pricing_plan && promotion.pricing_plan.price) || 
                0
            );
            setAmountToPay(detected);
        }
    }, [fixedAmount, promotion]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) setScreenshot(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!screenshot) return setError('Please upload a screenshot.');
        if (amountToPay <= 0) return setError('Please enter a valid amount.');

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('amount', amountToPay);
            // formData.append('promotion_id', promotion.id); // Uncomment if backend requires it

            await supplierService.submitCommissionProof(formData); 
            setIsSuccess(true);
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!promotion) return null;

    return (
        <div className="promo-modal-overlay">
            <div className="promo-modal-content">
                <button className="promo-close-btn" onClick={onClose}><X /></button>

                {!isSuccess ? (
                    <>
                        <div className="promo-modal-header">
                            <h2>Activate Promotion</h2>
                            <p className="promo-sub-text">
                                Pay <span className="promo-price-tag">PKR 
                                {amountToPay > 0 ? (
                                    ` ${amountToPay.toLocaleString()}`
                                ) : (
                                    <input 
                                        type="number" 
                                        className="manual-price-input" 
                                        placeholder="Enter Amount"
                                        value={amountToPay || ''}
                                        onChange={(e) => setAmountToPay(parseFloat(e.target.value))}
                                    />
                                )}
                                </span> to start campaign.
                            </p>
                        </div>

                        <div className="promo-accounts-box">
                            <div className="promo-account-row">
                                <span className="pa-label"><CreditCard size={16}/> Upaisa</span>
                                <span className="pa-number">0334 8846378</span>
                            </div>
                            <div className="promo-account-row">
                                <span className="pa-label"><CreditCard size={16}/> JazzCash</span>
                                <span className="pa-number">0349 5643002</span>
                            </div>
                            <div style={{textAlign:'center', marginTop:'10px', fontSize:'0.8rem', color:'#6b7280'}}>
                                Title: <strong>Azher Mehmood</strong>
                            </div>
                        </div>

                        <div className="promo-upload-area">
                            <input type="file" accept="image/*" className="promo-file-input" onChange={handleFileChange} />
                            {screenshot ? (
                                <div className="promo-file-name"><CheckCircle size={18} /> {screenshot.name.substring(0, 20)}...</div>
                            ) : (
                                <div className="promo-upload-placeholder">
                                    <Upload size={24} style={{display:'block', margin:'0 auto 5px'}}/>
                                    Tap to Upload Payment Screenshot
                                </div>
                            )}
                        </div>

                        {error && <p style={{color:'#ef4444', textAlign:'center', marginBottom:'15px'}}>{error}</p>}

                        <button className="promo-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Submit Payment Proof'}
                        </button>
                    </>
                ) : (
                    <div style={{textAlign:'center', padding:'20px'}}>
                        <CheckCircle size={64} color="#10b981" style={{margin:'0 auto 20px'}} />
                        <h2 style={{color:'#065f46', marginBottom:'10px'}}>Submitted!</h2>
                        <p style={{color:'#4b5563', lineHeight:'1.5'}}>
                            Your request for <strong>{promotion.product_title}</strong> is under review. 
                            It will be active within 6-12 hours.
                        </p>
                        <button className="promo-btn-submit" style={{marginTop:'20px'}} onClick={() => window.location.reload()}>
                            Okay, Got it
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionPaymentModal;