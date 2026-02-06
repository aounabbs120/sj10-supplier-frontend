// src/pages/PromotionDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import supplierService from '../services/supplierService';
import PromotionPaymentModal from '../components/PromotionPaymentModal';
import { formatCount } from '../utils/formatCount'; 
import './PromotionDetail.css';

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [promotion, setPromotion] = useState(location.state?.promotion || null);
    const [priceOverride, setPriceOverride] = useState(location.state?.priceOverride || 0);
    const [productStats, setProductStats] = useState({ views: 0 });
    const [loading, setLoading] = useState(!location.state?.promotion);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // 🔥 NEW: Detailed Timer State
    const [timer, setTimer] = useState({ d: '00', h: '00', m: '00', s: '00', expired: false });

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                let promoData = promotion;
                // If direct link, fetch fresh
                if (!promoData) {
                    promoData = await (supplierService.getPromotionById 
                        ? supplierService.getPromotionById(id) 
                        : supplierService.getMyPromotions().then(list => list.find(p => p.id == id)));
                }

                if (promoData) {
                    setPromotion(promoData);
                    if (priceOverride === 0 && promoData.price_paid) {
                        setPriceOverride(parseFloat(promoData.price_paid));
                    }
                    // Fetch Live Stats
                    if (promoData.product_id) {
                        try {
                            const productData = await supplierService.getProductById(promoData.product_id);
                            if (productData) setProductStats({ views: productData.views || 0 });
                        } catch (err) { console.error(err); }
                    }
                }
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchDetail();
    }, [id]);

    // --- ⚡ INSTANT & ACCURATE TIMER (Every Second) ---
    useEffect(() => {
        if (!promotion || !promotion.end_date || ['pending_approval', 'rejected'].includes(promotion.payment_status)) return;

        const calculateTime = () => {
            const now = new Date().getTime();
            const end = new Date(promotion.end_date).getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimer({ d: '00', h: '00', m: '00', s: '00', expired: true });
            } else {
                setTimer({
                    d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((distance % (1000 * 60)) / 1000),
                    expired: false
                });
            }
        };

        calculateTime(); // Run immediately on load
        const interval = setInterval(calculateTime, 1000); // Update every second

        return () => clearInterval(interval);
    }, [promotion]);

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
    if (!promotion) return <div className="error-screen">Promotion Not Found</div>;

    // --- RENDER HELPERS ---
    const renderStatusBadge = (status) => {
        let className = 'status-default';
        let text = (status || '').replace(/_/g, ' ');
        if (status === 'pending_approval') { className = 'status-pending'; text = 'Pending Payment'; }
        else if (status === 'verification_pending') { className = 'status-review'; text = 'Under Review'; }
        else if (['active', 'paid'].includes(status)) { className = 'status-active'; text = 'Active'; }
        else if (status === 'expired') { className = 'status-expired'; text = 'Expired'; }
        return <span className={`status-badge-lg ${className}`}>{text}</span>;
    };

    const renderDateSection = () => {
        // If Active or Expired -> Show Big Red Timer
        if (promotion.start_date && promotion.end_date) {
            return (
                <div className="active-timer-section">
                    <div className="date-ranges">
                        <div className="dr-item">
                            <span className="dr-label">Start Date</span>
                            <span className="dr-val">{new Date(promotion.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="dr-separator">➔</div>
                        <div className="dr-item">
                            <span className="dr-label">End Date</span>
                            <span className="dr-val">{new Date(promotion.end_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    {!timer.expired ? (
                        <div className="live-countdown">
                            <div className="lc-label">Time Remaining</div>
                            <div className="lc-digits">
                                <span className="lc-unit">{timer.d} <small>d</small></span> : 
                                <span className="lc-unit">{timer.h} <small>h</small></span> : 
                                <span className="lc-unit">{timer.m} <small>m</small></span> : 
                                <span className="lc-unit red-pulse">{timer.s} <small>s</small></span>
                            </div>
                        </div>
                    ) : (
                        <div className="expired-banner">Promotion Expired</div>
                    )}
                </div>
            );
        }
        // If Pending
        return (
            <div className="dates-row">
                <div className="date-group">
                    <span className="d-label">Selected Plan</span>
                    <span className="d-val">{promotion.duration_days || '7'} Days</span>
                </div>
                <div className="date-group right">
                    <span className="d-label">Status</span>
                    <span className="d-val">Waiting Approval</span>
                </div>
            </div>
        );
    };

    let productImageUrl = 'https://via.placeholder.com/400';
    try { productImageUrl = JSON.parse(promotion.product_image_urls)[0]; } catch(e){}

    const proofUrl = promotion.screenshot_url || promotion.payment_proof || null;
    const showStats = ['active', 'paid', 'expired', 'successful'].includes(promotion.payment_status);
    const liveViews = productStats.views;

    return (
        <div className="detail-page-wrapper">
            <div className="detail-header">
                <button className="btn-back-link" onClick={() => navigate('/promotions')}>← Back</button>
                <h1 className="detail-title">Promotion Details</h1>
            </div>

            <div className="detail-layout">
                <div className="detail-visuals">
                    <div className="main-image-card">
                        <img src={productImageUrl} alt="Product" className="detail-product-img" />
                        <div className="visual-overlay"><h3>{promotion.product_title}</h3></div>
                    </div>
                    
                    {promotion.payment_status === 'pending_approval' && (
                        <div className="pending-action-box">
                            <div className="pending-msg">Payment Required to Activate</div>
                            <button className="btn-pay-large" onClick={() => setIsPaymentModalOpen(true)}>Pay Now ➔</button>
                        </div>
                    )}
                    
                    {/* ✅ FIX: SHOW PROOF IF URL EXISTS, REGARDLESS OF STATUS */}
                    {proofUrl && (
                        <div className="proof-display-box">
                            <div className="proof-header">
                                <span className="proof-icon">🧾</span> 
                                {showStats ? 'Payment Record' : 'Payment Proof Submitted'}
                            </div>
                            <div className="proof-img-wrapper">
                                <img src={proofUrl} alt="Payment Proof" />
                            </div>
                            {!showStats && (
                                <div className="proof-note">Waiting for admin verification (6-12 Hours)</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <div className="info-card header-card">
                        <div className="status-row">
                            <span className="label">Current Status</span>
                            {renderStatusBadge(promotion.payment_status)}
                        </div>
                        {renderDateSection()}
                    </div>

                    {showStats ? (
                        <div className="stats-grid animate-fade-in">
                            <div className="stat-card blue">
                                <div className="stat-icon">👁️</div>
                                <div className="stat-number">{formatCount ? formatCount(liveViews) : liveViews}</div>
                                <div className="stat-label">Total Views</div>
                            </div>
                            <div className="stat-card green">
                                <div className="stat-icon">🖱️</div>
                                <div className="stat-number">{formatCount ? formatCount(liveViews) : liveViews}</div>
                                <div className="stat-label">Clicks</div>
                            </div>
                            <div className="stat-card purple">
                                <div className="stat-icon">💰</div>
                                <div className="stat-number">{priceOverride > 0 ? priceOverride.toLocaleString() : '---'}</div>
                                <div className="stat-label">Cost (PKR)</div>
                            </div>
                        </div>
                    ) : (
                        <div className="stats-locked-msg">
                            📊 Statistics will appear here once the promotion is <strong>Active</strong>.
                        </div>
                    )}
                </div>
            </div>

            {isPaymentModalOpen && (
                <PromotionPaymentModal 
                    promotion={promotion}
                    fixedAmount={priceOverride}
                    onClose={() => { setIsPaymentModalOpen(false); }} 
                />
            )}
        </div>
    );
};

export default PromotionDetail;