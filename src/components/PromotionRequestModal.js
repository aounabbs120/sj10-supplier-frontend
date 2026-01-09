// src/components/PromotionRequestModal.js
import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService';
import './PromotionRequestModal.css';

const PromotionRequestModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [products, setProducts] = useState([]);
    const [pricingOptions, setPricingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [prods, prices] = await Promise.all([
                    supplierService.getMyProducts(),
                    supplierService.getPromotionPricing()
                ]);
                setProducts(prods || []);
                setPricingOptions(prices || []);
            } catch (err) {
                console.error("Modal Fetch Error:", err);
                setError("Failed to load products or pricing.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // --- 🛡️ CRASH-PROOF IMAGE HELPER ---
    const getSafeImage = (imageField) => {
        const placeholder = 'https://via.placeholder.com/100';
        if (!imageField) return placeholder;

        // 1. If Backend sends an Array (New Way) -> Use it directly
        if (Array.isArray(imageField)) {
            return imageField[0] || placeholder;
        }

        // 2. If Backend sends Text (Old Way) -> Parse it safely
        if (typeof imageField === 'string') {
            if (imageField.startsWith('http')) return imageField; // It's just a URL
            try {
                const parsed = JSON.parse(imageField);
                return Array.isArray(parsed) ? parsed[0] : placeholder;
            } catch (e) { return placeholder; }
        }
        return placeholder;
    };

    const handleSubmit = async () => {
        if (!selectedProduct || !selectedPlan) return;
        setSubmitting(true);
        try {
            await supplierService.requestPromotion({
                productId: selectedProduct.id,
                pricingId: selectedPlan.id
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit request.");
            setSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="modal-step">
            <h3>Step 1: Select a Product</h3>
            <div className="product-select-list">
                {products.length === 0 ? (
                    <p style={{textAlign:'center', color:'#666'}}>No products found.</p>
                ) : (
                    products.map(p => {
                        // ✅ USE THE HELPER HERE
                        const img = getSafeImage(p.image_urls); 
                        const isSelected = selectedProduct?.id === p.id;
                        
                        return (
                            <div 
                                key={p.id} 
                                className={`select-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedProduct(p)}
                            >
                                <img src={img} alt={p.title} className="item-thumb" />
                                <div className="item-info">
                                    <div className="item-title">{p.title}</div>
                                    <div className="item-sku">{p.sku}</div>
                                </div>
                                {isSelected && <span className="check-icon">✔</span>}
                            </div>
                        );
                    })
                )}
            </div>
            <button 
                className="btn btn-primary full-width" 
                disabled={!selectedProduct}
                onClick={() => setStep(2)}
                style={{marginTop:'15px'}}
            >
                Next: Select Plan
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="modal-step">
            <h3>Step 2: Select a Plan</h3>
            <div className="plan-select-grid">
                {pricingOptions.map(plan => {
                    const isSelected = selectedPlan?.id === plan.id;
                    return (
                        <div 
                            key={plan.id} 
                            className={`plan-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                        >
                            <div className="plan-name">{plan.name}</div>
                            <div className="plan-price">PKR {plan.price.toLocaleString()}</div>
                            <div className="plan-days">{plan.duration_days} Days Duration</div>
                        </div>
                    )
                })}
            </div>
            <div className="step-actions">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button 
                    className="btn btn-primary" 
                    disabled={!selectedPlan || submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                {loading ? <div className="modal-loading">Loading...</div> : 
                 error ? <div className="modal-error"><p>{error}</p></div> : 
                 (step === 1 ? renderStep1() : renderStep2())}
            </div>
        </div>
    );
};

export default PromotionRequestModal;