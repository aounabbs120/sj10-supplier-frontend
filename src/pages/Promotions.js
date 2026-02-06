// src/pages/Promotions.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import PromotionPaymentModal from '../components/PromotionPaymentModal';
import './Promotions.css';

const Promotions = ({ setIsLoading }) => {
    const navigate = useNavigate(); // ✅ Add this hook
    const [promotions, setPromotions] = useState([]);
    const [pricingPlans, setPricingPlans] = useState([]); 
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedPromoForPayment, setSelectedPromoForPayment] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [promosData, plansData] = await Promise.all([
                supplierService.getMyPromotions(),
                supplierService.getPromotionPricing()
            ]);
            setPromotions(promosData || []);
            setPricingPlans(plansData || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Could not load data.');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setPageLoading(false);
            }, 500);
        }
    }, [setIsLoading]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- 1. SMART DATE DISPLAY ---
    const renderTimeInfo = (promo) => {
        // A. If Active/Paid (Dates are set)
        if (promo.start_date && promo.end_date) {
            const end = new Date(promo.end_date);
            const now = new Date();
            
            if (promo.payment_status === 'expired' || now > end) {
                return <span className="time-badge expired">Expired</span>;
            }
            return (
                <div className="time-info">
                    <span className="time-label">Ends:</span>
                    <span className="time-val">{end.toLocaleDateString()}</span>
                </div>
            );
        }
        
        // B. If Pending (No dates yet)
        return (
            <div className="time-info">
                <span className="time-label">Duration:</span>
                <span className="time-val">{promo.duration_days || '?'} Days Plan</span>
            </div>
        );
    };

    const renderPromoStatus = (status) => {
        let className = 'status-default';
        let text = (status || 'Unknown').replace(/_/g, ' ');

        if (status === 'pending_approval') {
            className = 'status-pending'; text = 'Pay Now'; // Pending Creation
        } else if (status === 'verification_pending') {
            className = 'status-review'; text = 'Under Review'; // Proof Uploaded
        } else if (['paid', 'active', 'successful'].includes(status)) {
            className = 'status-active'; text = 'Active';
        } else if (['rejected', 'expired'].includes(status)) {
            className = 'status-rejected';
        }
        return <span className={`status-badge ${className}`}>{text}</span>;
    };

    const getSafeImage = (imageField) => {
        const placeholder = 'https://via.placeholder.com/300';
        if (!imageField) return placeholder;
        if (Array.isArray(imageField)) return imageField[0] || placeholder;
        if (typeof imageField === 'string') {
            if (imageField.startsWith('http')) return imageField;
            try { return JSON.parse(imageField)[0] || placeholder; } catch (e) { return placeholder; }
        }
        return placeholder;
    };

    const getPrice = (promo) => {
        if (!promo) return 0;
        if (promo.price_paid && parseFloat(promo.price_paid) > 0) return parseFloat(promo.price_paid);
        if (promo.price && parseFloat(promo.price) > 0) return parseFloat(promo.price);
        // Fallback to plan lookup
        if (pricingPlans.length > 0 && (promo.pricing_id || promo.plan_id)) {
            const plan = pricingPlans.find(p => p.id == (promo.pricing_id || promo.plan_id));
            if (plan) return parseFloat(plan.price);
        }
        return 0;
    };

    // --- 2. BUTTON LOGIC (The most important part) ---
    // Only show "Pay Now" if it is strictly 'pending_approval' (no proof yet).
    const showPayNow = (status) => status === 'pending_approval';

    if (pageLoading) return null;

    return (
        <div className="promotions-container">
            <div className="page-header">
                <h1 className="main-header">Promotions</h1>
                 <button className="btn btn-primary" onClick={() => navigate('/promotions/create')}>
                    + New Promotion
                </button>
            </div>

            <div className="promo-grid-container">
                {promotions.length > 0 ? (
                    promotions.map(p => {
                        const imgUrl = getSafeImage(p.product_image_urls);
                        const displayPrice = getPrice(p);

                        return (
                            <div className="promo-item-card" key={p.id}>
                                <div className="card-top">
                                    <div className="status-overlay">
                                        {renderPromoStatus(p.payment_status)}
                                    </div>
                                    <img src={imgUrl} alt={p.product_title} />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">{p.product_title}</h3>
                                    
                                    <div className="card-dates">
                                        {renderTimeInfo(p)}
                                    </div>
                                    
                                    <div style={{fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '10px'}}>
                                        Price: <strong>PKR {displayPrice > 0 ? displayPrice.toLocaleString() : '---'}</strong>
                                    </div>

                                    <div className="card-actions">
                                        {showPayNow(p.payment_status) && (
                                            <button className="btn btn-success" onClick={() => setSelectedPromoForPayment(p)}>
                                                Pay Now
                                            </button>
                                        )}
                                        <Link 
                                            to={`/promotions/${p.id}`} 
                                            state={{ promotion: p, priceOverride: displayPrice }} 
                                            className="btn btn-secondary"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    !error && <div className="no-promo-msg">No Active Promotions</div>
                )}
            </div>
            
            
            
            {selectedPromoForPayment && (
                <PromotionPaymentModal 
                    promotion={selectedPromoForPayment} 
                    fixedAmount={getPrice(selectedPromoForPayment)}
                    onClose={() => { setSelectedPromoForPayment(null); fetchData(); }} 
                />
            )}
        </div>
    );
};

export default Promotions;