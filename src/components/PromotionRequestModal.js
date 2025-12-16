// src/components/PromotionRequestModal.js

import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService';

const PromotionRequestModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [products, setProducts] = useState([]);
    const [pricingOptions, setPricingOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedPricingId, setSelectedPricingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, pricingData] = await Promise.all([
                    supplierService.getMyProducts(),
                    supplierService.getPromotionPricing()
                ]);
                setProducts(productsData);
                setPricingOptions(pricingData);
            } catch (error) {
                console.error("Failed to load promotion data", error);
                alert("Could not load data. Please try again.");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [onClose]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await supplierService.requestPromotion({
                productId: selectedProductId,
                pricingId: selectedPricingId,
            });
            onSuccess();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <>
            <h2>Step 1: Select a Product to Promote</h2>
            <div className="promo-selection-grid">
                {products.map(p => (
                    <div 
                        key={p.id}
                        className={`promo-card ${selectedProductId === p.id ? 'selected' : ''}`}
                        onClick={() => setSelectedProductId(p.id)}
                    >
                        <img src={(JSON.parse(p.image_urls || '[]')[0]) || 'https://via.placeholder.com/100'} alt={p.title} />
                        <span>{p.title}</span>
                    </div>
                ))}
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" disabled={!selectedProductId} onClick={() => setStep(2)}>Next</button>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <h2>Step 2: Choose a Duration</h2>
            <div className="promo-selection-grid pricing">
                {pricingOptions.map(opt => (
                    <div 
                        key={opt.id}
                        className={`promo-card pricing ${selectedPricingId === opt.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPricingId(opt.id)}
                    >
                        <h4>{opt.duration_days} Days</h4>
                        <p>PKR {opt.price}</p>
                    </div>
                ))}
            </div>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" disabled={!selectedPricingId || isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </>
    );

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                {isLoading ? <p>Loading...</p> : (step === 1 ? renderStep1() : renderStep2())}
            </div>
        </div>
    );
};

export default PromotionRequestModal;