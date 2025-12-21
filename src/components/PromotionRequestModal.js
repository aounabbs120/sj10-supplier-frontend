// src/components/PromotionRequestModal.js
import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService';
// Ensure CSS from main file is applied or import specific CSS here if modular

const PromotionRequestModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [products, setProducts] = useState([]);
    const [pricingOptions, setPricingOptions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedPricingId, setSelectedPricingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, priceRes] = await Promise.all([
                    supplierService.getMyProducts(),
                    supplierService.getPromotionPricing()
                ]);
                setProducts(prodRes);
                setPricingOptions(priceRes);
            } catch (e) {
                alert("Failed to load options.");
                onClose();
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [onClose]);

    const handleSubmit = async () => {
        if (!selectedProductId || !selectedPricingId) return;
        setIsSubmitting(true);
        try {
            await supplierService.requestPromotion({
                productId: selectedProductId,
                pricingId: selectedPricingId
            });
            onSuccess();
        } catch (error) {
            alert("Error submitting request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="animate-slide-up">
            <div className="wizard-header">
                <h2>Select Product</h2>
                <p style={{color: '#9ca3af'}}>Step 1 of 2</p>
            </div>
            <div className="wizard-grid">
                {products.map(p => {
                    const img = (JSON.parse(p.image_urls || '[]')[0]) || 'https://via.placeholder.com/150';
                    return (
                        <div 
                            key={p.id} 
                            className={`selection-card ${selectedProductId === p.id ? 'selected' : ''}`}
                            onClick={() => setSelectedProductId(p.id)}
                        >
                            <img src={img} alt={p.title} />
                            <div style={{fontSize: '0.9rem', fontWeight: '600'}}>{p.title}</div>
                        </div>
                    )
                })}
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button className="btn btn-primary" disabled={!selectedProductId} onClick={() => setStep(2)}>
                    Next Step →
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-slide-up">
            <div className="wizard-header">
                <h2>Select Plan</h2>
                <p style={{color: '#9ca3af'}}>Step 2 of 2</p>
            </div>
            <div className="wizard-grid">
                {pricingOptions.map(opt => (
                    <div 
                        key={opt.id}
                        className={`selection-card pricing ${selectedPricingId === opt.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPricingId(opt.id)}
                    >
                        <div className="duration-tag">{opt.duration_days} Days</div>
                        <div className="price-tag">PKR {opt.price}</div>
                        <div style={{fontSize: '0.8rem', color: '#9ca3af'}}>Full Coverage</div>
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-success" disabled={!selectedPricingId || isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? 'Processing...' : 'Done'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                {loadingData ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#fff'}}>Loading options...</div>
                ) : (
                    step === 1 ? renderStep1() : renderStep2()
                )}
            </div>
        </div>
    );
};

export default PromotionRequestModal;