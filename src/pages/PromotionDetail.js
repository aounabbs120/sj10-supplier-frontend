import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import supplierService from '../services/supplierService';
import PromotionPaymentModal from '../components/PromotionPaymentModal';
import './PromotionDetail.css';

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [promotion, setPromotion] = useState(location.state?.promotion || null);
    // Receive priceOverride if passed from list page
    const [priceOverride, setPriceOverride] = useState(location.state?.priceOverride || 0);
    const [loading, setLoading] = useState(!location.state?.promotion);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (promotion && priceOverride > 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch Details AND Plans (to map price if missing)
                const [promoData, plansData] = await Promise.all([
                    supplierService.getPromotionById ? supplierService.getPromotionById(id) : supplierService.getMyPromotions().then(list => list.find(p => p.id == id)),
                    supplierService.getPromotionPricing()
                ]);

                if (promoData) {
                    setPromotion(promoData);
                    
                    // Logic to find price if we didn't get it from state
                    let foundPrice = 0;
                    if (promoData.price) foundPrice = parseFloat(promoData.price);
                    else if (promoData.amount) foundPrice = parseFloat(promoData.amount);
                    else if (promoData.pricing_plan) foundPrice = parseFloat(promoData.pricing_plan.price);
                    else if (plansData && (promoData.pricing_id || promoData.plan_id)) {
                        const plan = plansData.find(pl => pl.id == (promoData.pricing_id || promoData.plan_id));
                        if (plan) foundPrice = parseFloat(plan.price);
                    }
                    
                    setPriceOverride(foundPrice);
                }
            } catch (error) {
                console.error("Error fetching detail", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, promotion, priceOverride]);

    if (loading) return <div className="loading-screen"><div className="spinner"></div>Loading...</div>;
    
    if (!promotion) return (
        <div className="error-screen">
            <div className="error-box">
                <h2>Promotion Not Found</h2>
                <button className="btn-back-link" onClick={() => navigate('/promotions')}>Go Back</button>
            </div>
        </div>
    );

    const getDuration = () => {
        if (!promotion.end_date) return 'N/A';
        const start = new Date(promotion.start_date || promotion.created_at);
        const end = new Date(promotion.end_date);
        return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)); 
    };

    const renderStatusBadge = (status) => {
        let className = 'status-badge-lg status-default';
        let text = (status || '').replace(/_/g, ' ');
        if (status === 'pending_approval' || status === 'approved_awaiting_payment') {
            className = 'status-badge-lg status-pending'; text = 'Pending Payment';
        } else if (['active', 'paid', 'successful'].includes(status)) {
            className = 'status-badge-lg status-active'; text = 'Active Running';
        } else if (status === 'rejected') {
            className = 'status-badge-lg status-rejected';
        }
        return <span className={className}>{text}</span>;
    };

    const isPending = promotion.payment_status === 'pending_approval' || promotion.payment_status === 'approved_awaiting_payment';
    let imageUrl = 'https://via.placeholder.com/400';
    try {
        if (promotion.product_image_urls) {
            const parsed = JSON.parse(promotion.product_image_urls);
            if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
        }
    } catch (e) {}

    return (
        <div className="detail-page-wrapper">
            <div className="detail-header">
                <button className="btn-back-link" onClick={() => navigate('/promotions')}>← Back to Promotions</button>
                <h1 className="detail-title">Promotion Dashboard</h1>
            </div>

            <div className="detail-layout">
                <div className="detail-visuals">
                    <div className="main-image-card">
                        <img src={imageUrl} alt="Product" className="detail-product-img" />
                        <div className="visual-overlay"><h3>{promotion.product_title}</h3></div>
                    </div>
                    {isPending && (
                        <div className="pending-action-box">
                            <div className="pending-msg"><strong>Action Required:</strong> Payment is pending.</div>
                            <button className="btn-pay-large" onClick={() => setIsPaymentModalOpen(true)}>Pay Now ➔</button>
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <div className="info-card header-card">
                        <div className="status-row">
                            <span className="label">Current Status</span>
                            {renderStatusBadge(promotion.payment_status)}
                        </div>
                        <div className="dates-row">
                            <div className="date-group">
                                <span className="d-label">End Date</span>
                                <span className="d-val">{new Date(promotion.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="date-group right">
                                <span className="d-label">Duration</span>
                                <span className="d-val">{getDuration()} Days</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card blue">
                            <div className="stat-icon">👁️</div>
                            <div className="stat-number">{promotion.impressions_count || 0}</div>
                            <div className="stat-label">Impressions</div>
                        </div>
                        <div className="stat-card green">
                            <div className="stat-icon">🖱️</div>
                            <div className="stat-number">{promotion.clicks_count || 0}</div>
                            <div className="stat-label">Clicks</div>
                        </div>
                        <div className="stat-card purple">
                            <div className="stat-icon">💰</div>
                            <div className="stat-number">{priceOverride > 0 ? priceOverride.toLocaleString() : '---'}</div>
                            <div className="stat-label">Cost (PKR)</div>
                        </div>
                    </div>
                </div>
            </div>

            {isPaymentModalOpen && (
                <PromotionPaymentModal 
                    promotion={promotion}
                    fixedAmount={priceOverride} // Pass the calculated price
                    onClose={() => setIsPaymentModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default PromotionDetail;