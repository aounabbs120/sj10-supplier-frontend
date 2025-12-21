// src/pages/Promotions.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import PromotionRequestModal from '../components/PromotionRequestModal';
import PaymentModal from '../components/PaymentModal';
import './Promotions.css';

const Promotions = ({ setIsLoading }) => {
    const [promotions, setPromotions] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await supplierService.getMyPromotions();
            setPromotions(data);
        } catch (err) {
            setError('Could not load promotions.');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setPageLoading(false);
            }, 500);
        }
    }, [setIsLoading]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

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
                        const imgUrl = (JSON.parse(p.product_image_urls || '[]')[0]) || 'https://via.placeholder.com/300';
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
                                    <div className="card-actions">
                                        {showPayNow(p.payment_status) && (
                                            <button className="btn btn-success" onClick={() => setIsPaymentModalOpen(true)}>
                                                Pay Now
                                            </button>
                                        )}
                                        {/* CRITICAL UPDATE: Pass state here */}
                                        <Link 
                                            to={`/promotions/${p.id}`} 
                                            state={{ promotion: p }} 
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
                <PromotionRequestModal onClose={() => setIsRequestModalOpen(false)} onSuccess={() => { setIsRequestModalOpen(false); fetchPromotions(); }} />
            )}
            {isPaymentModalOpen && <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />}
        </div>
    );
};

export default Promotions;