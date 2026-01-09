import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import PromotionRequestModal from '../components/PromotionRequestModal'; 
import PromotionPaymentModal from '../components/PromotionPaymentModal';
import './Promotions.css';

const Promotions = ({ setIsLoading }) => {
    const [promotions, setPromotions] = useState([]);
    // New State: Store pricing plans to lookup prices
    const [pricingPlans, setPricingPlans] = useState([]); 
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedPromoForPayment, setSelectedPromoForPayment] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch Promotions AND Pricing Plans in parallel
            const [promosData, plansData] = await Promise.all([
                supplierService.getMyPromotions(),
                supplierService.getPromotionPricing() // Ensure this endpoint exists
            ]);
            
            setPromotions(promosData || []);
            setPricingPlans(plansData || []);
            
            // Console log for debugging (Check your browser console F12)
            console.log("Promotions:", promosData);
            console.log("Plans:", plansData);

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

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getDurationText = (promo) => {
        if (!promo.start_date || !promo.end_date) return 'N/A';
        const start = new Date(promo.start_date);
        const end = new Date(promo.end_date);
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        return `${diffDays} Days`;
    };

    const renderPromoStatus = (status) => {
        let className = 'status-default';
        let text = (status || 'Unknown').replace(/_/g, ' ');

        if (status === 'pending_approval' || status === 'approved_awaiting_payment') {
            className = 'status-pending';
            text = 'Pending Approval';
        } else if (['paid', 'active', 'successful'].includes(status)) {
            className = 'status-active';
            text = 'Active';
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
            try {
                const parsed = JSON.parse(imageField);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) { return placeholder; }
        }
        return placeholder;
    };

    // --- ⚡ FINAL FIXED PRICE FINDER ⚡ ---
    const getPrice = (promo) => {
        if (!promo) return 0;

        // 1. Direct Price on Object
        if (promo.price && parseFloat(promo.price) > 0) return parseFloat(promo.price);
        if (promo.amount && parseFloat(promo.amount) > 0) return parseFloat(promo.amount);
        if (promo.cost && parseFloat(promo.cost) > 0) return parseFloat(promo.cost);

        // 2. Nested Price in pricing_plan object
        if (promo.pricing_plan && parseFloat(promo.pricing_plan.price) > 0) {
            return parseFloat(promo.pricing_plan.price);
        }

        // 3. LOOKUP: Match pricing_id with the fetched Plans list
        if (pricingPlans.length > 0 && (promo.pricing_id || promo.plan_id)) {
            const planId = promo.pricing_id || promo.plan_id;
            const matchedPlan = pricingPlans.find(plan => plan.id == planId);
            if (matchedPlan && matchedPlan.price) {
                return parseFloat(matchedPlan.price);
            }
        }

        return 0; // Still 0? Then manual entry is the only way.
    };

    const showPayNow = (status) => status === 'pending_approval' || status === 'approved_awaiting_payment';

    if (pageLoading) return null;

    return (
        <div className="promotions-container">
            <div className="page-header">
                <h1 className="main-header">Promotions</h1>
                <button className="btn btn-primary" onClick={() => setIsRequestModalOpen(true)}>
                    + New Promotion
                </button>
            </div>

            <div className="alert-banner">
                <span className="alert-icon">⚠️</span>
                <p><strong>Note:</strong> Unpaid requests are deleted after 60 days.</p>
            </div>

            {error && <p style={{color: '#ef4444'}}>{error}</p>}
            
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
                                        <span>Ends: {new Date(p.end_date).toLocaleDateString()}</span>
                                        <span className="card-duration-badge">{getDurationText(p)}</span>
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
                    !error && <div style={{textAlign:'center', padding:'50px', color:'#9ca3af'}}>No Active Promotions</div>
                )}
            </div>
            
            {isRequestModalOpen && (
                <PromotionRequestModal onClose={() => setIsRequestModalOpen(false)} onSuccess={() => { setIsRequestModalOpen(false); fetchData(); }} />
            )}
            
            {/* Pass the calculated price to the modal */}
            {selectedPromoForPayment && (
                <PromotionPaymentModal 
                    promotion={selectedPromoForPayment} 
                    fixedAmount={getPrice(selectedPromoForPayment)}
                    onClose={() => setSelectedPromoForPayment(null)} 
                />
            )}
        </div>
    );
};

export default Promotions;