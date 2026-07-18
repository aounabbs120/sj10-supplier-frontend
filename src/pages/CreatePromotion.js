// src/pages/CreatePromotion.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './CreatePromotion.css';

const CreatePromotion = () => {
    const navigate = useNavigate();
    
    // Data State
    const [products, setProducts] = useState([]); 
    const [plans, setPlans] = useState([]);
    
    // Loading States
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // UI & Pagination State
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Selection State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // ⚡ 1. Debounce Search (Wait 500ms after user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== searchQuery) {
                setDebouncedSearch(searchQuery);
                setPage(1); // Reset page to 1 on new search
                setProducts([]); // Clear old list
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, debouncedSearch]);

    // ⚡ 2. Fetch Pricing Plans (Runs only once)
    useEffect(() => {
        supplierService.getPromotionPricing()
            .then(prices => setPlans(prices || []))
            .catch(console.error);
    }, []);

    // ⚡ 3. Fetch Products in Batches from Naya Backend Endpoint
    useEffect(() => {
        const fetchProducts = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                // Calling the New Oracle-Optimized Endpoint
                const res = await supplierService.getProductsForPromotionSelect(page, debouncedSearch);
                
                if (page === 1) {
                    setProducts(res.products || []);
                } else {
                    setProducts(prev => [...prev, ...(res.products || [])]);
                }
                setHasMore(res.hasMore);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchProducts();
    }, [page, debouncedSearch]);

    // ⚡ 4. REAL INFINITE SCROLL LISTENER
    useEffect(() => {
        const handleScroll = () => {
            // Trigger fetch when user is 300px from the bottom
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300) {
                if (hasMore && !loadingMore && !loading) {
                    setPage(prev => prev + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore, loading]);

    // Format Image properly
    const getSafeImage = (imageField) => {
        const placeholder = 'https://via.placeholder.com/100';
        if (!imageField) return placeholder;
        return imageField; // New backend directly sends `p.image` as a clean URL
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

    // --- RENDER LOADER (Only for Initial Page 1 Load) ---
    if (loading && page === 1) return (
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
                            placeholder="🔍 Search title or SKU..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="wizard-list">
                        {products.length === 0 && !loading ? (
                            <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>
                                No products found matching "{searchQuery}"
                            </div>
                        ) : (
                            products.map(p => {
                                const isSelected = selectedProduct?.id === p.id;
                                return (
                                    <div 
                                        key={p.id} 
                                        className={`wizard-product-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(p)}
                                    >
                                        <img src={getSafeImage(p.image)} alt="" className="wp-image"/>
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
                        
                        {/* Loading Spinner at Bottom for Infinite Scroll */}
                        {loadingMore && (
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