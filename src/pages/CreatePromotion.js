// src/pages/CreatePromotion.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './CreatePromotion.css';

const CreatePromotion = () => {
    const navigate = useNavigate();
    
    // Data State
    const [allProducts, setAllProducts] = useState([]); // Store ALL 3000 here
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // ⚡ LAZY LOAD STATE ⚡
    const [visibleCount, setVisibleCount] = useState(40); // Start with 40
    
    // Selection State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [prods, prices] = await Promise.all([
                    supplierService.getMyProducts(),
                    supplierService.getPromotionPricing()
                ]);
                setAllProducts(prods || []);
                setPlans(prices || []);
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        loadData();
    }, []);

    // 🔄 Reset lazy load when searching
    useEffect(() => {
        setVisibleCount(40);
        window.scrollTo(0, 0);
    }, [searchQuery]);

    // ⚡ INFINITE SCROLL LISTENER ⚡
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is near bottom of page
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300) {
                setVisibleCount(prev => prev + 40); // Load next 40
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ⚡ SMART FILTERING + SLICING ⚡
    const displayProducts = useMemo(() => {
        if (!allProducts) return [];
        const lowerQuery = searchQuery.toLowerCase();
        
        // 1. Filter ALL products first
        const filtered = allProducts.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            (p.sku && p.sku.toLowerCase().includes(lowerQuery))
        );
        
        // 2. Then Slice based on how far we scrolled
        return filtered.slice(0, visibleCount);
        
    }, [allProducts, searchQuery, visibleCount]);

    const getSafeImage = (imageField) => {
        const placeholder = 'https://via.placeholder.com/100';
        if (!imageField) return placeholder;
        if (Array.isArray(imageField)) return imageField[0] || placeholder;
        try { return JSON.parse(imageField)[0] || placeholder; } catch (e) { return placeholder; }
    };

    const handleNext = () => {
        if (step === 1 && selectedProduct) {
            window.scrollTo(0, 0); 
            setStep(2);
        }
        if (step === 2 && selectedPlan) handleSubmit();
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await supplierService.requestPromotion({
                productId: selectedProduct.id,
                pricingId: selectedPlan.id
            });
            navigate('/promotions');
        } catch (err) {
            console.error(err);
            alert("Failed to create promotion.");
            setSubmitting(false);
        }
    };

    // --- RENDER LOADER ---
    if (loading) return (
        <div className="wizard-container">
            <div className="loader-wrapper">
                <div className="package-loader"></div>
                <div className="loader-text">Loading Products...</div>
            </div>
        </div>
    );

    const showStickyBar = (step === 1 && selectedProduct) || (step === 2 && selectedPlan);

    return (
        <div className="wizard-container">
            {/* Header */}
            <div className="wizard-header">
                <button className="wizard-back-btn" onClick={() => step === 1 ? navigate('/promotions') : setStep(1)}>
                    {step === 1 ? '✕' : '←'}
                </button>
                <div style={{flex:1, marginLeft:'10px'}}>
                    <h2 className="wizard-title">
                        {step === 1 ? 'Select Product' : 'Choose Plan'}
                    </h2>
                    <div style={{fontSize:'0.8rem', color:'#6b7280'}}>
                        {step === 1 ? 'Which item to boost?' : 'How long to run?'}
                    </div>
                </div>
                <div className="step-indicator">Step {step}/2</div>
            </div>

            {/* STEP 1: Product Selection */}
            {step === 1 && (
                <>
                    <div className="wizard-search-box">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="🔍 Search product..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="wizard-list">
                        {displayProducts.length === 0 ? (
                            <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>
                                No products found matching "{searchQuery}"
                            </div>
                        ) : (
                            displayProducts.map(p => {
                                const isSelected = selectedProduct?.id === p.id;
                                return (
                                    <div 
                                        key={p.id} 
                                        className={`wizard-product-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(p)}
                                    >
                                        <img src={getSafeImage(p.image_urls)} alt="" className="wp-image"/>
                                        <div className="wp-details">
                                            <div className="wp-title">{p.title}</div>
                                            <div className="wp-sku">{p.sku}</div>
                                        </div>
                                        <div className="wp-checkbox">
                                            {isSelected ? <span style={{color:'white', fontSize:'14px'}}>✓</span> : null}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        
                        {/* Loading Spinner at Bottom */}
                        {allProducts.length > visibleCount && displayProducts.length > 0 && (
                            <div style={{textAlign:'center', padding:'20px', color:'#6366f1'}}>
                                <span className="spinner-small"></span> Loading more...
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* STEP 2: Plan Selection */}
            {step === 2 && (
                <div className="wizard-plans-grid">
                    {plans.map(plan => {
                        const isSelected = selectedPlan?.id === plan.id;
                        return (
                            <div 
                                key={plan.id} 
                                className={`wizard-plan-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan(plan)}
                            >
                                <div className="plan-title">{plan.name}</div>
                                <div className="plan-price">PKR {plan.price.toLocaleString()}</div>
                                <div className="plan-duration">{plan.duration_days} Days</div>
                                {isSelected && <div style={{marginTop:'10px', color:'#6366f1', fontWeight:'bold'}}>Selected ✔</div>}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Animated Sticky Bottom Bar */}
            <div className={`sticky-action-bar ${showStickyBar ? 'visible' : ''}`}>
                <div className="action-bar-inner">
                    <button 
                        className="btn-wizard-next" 
                        onClick={handleNext}
                        disabled={submitting}
                    >
                        {step === 1 ? (
                            <>Next Step ➔</>
                        ) : (
                            <>{submitting ? 'Creating...' : 'Confirm & Create'}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePromotion;