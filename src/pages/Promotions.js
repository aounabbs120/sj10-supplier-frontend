// src/pages/Promotions.js (FULLY RESPONSIVE)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import PromotionRequestModal from '../components/PromotionRequestModal';
import PromotionCardMobile from '../components/PromotionCardMobile'; // Import the new mobile component
import './Promotions.css';

const renderPromoStatus = (status) => {
    let className = 'status-default';
    let text = (status || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    switch (status) {
        case 'pending_approval': className = 'status-pending'; break;
        case 'approved_awaiting_payment': className = 'status-awaiting-payment'; break;
        case 'paid':
        case 'active':
        case 'successful':
            className = 'status-active';
            text = 'Active';
            break;
        case 'rejected':
        case 'expired': className = 'status-cancelled'; break;
        default: break;
    }
    return <span className={`status-badge ${className}`}>{text}</span>;
};

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

    if (pageLoading) return null;

    return (
        <div className="promotions-container">
            <div className="page-header">
                <h1 className="main-header">Product Promotions</h1>
                <button className="btn btn-primary" onClick={() => setIsRequestModalOpen(true)}>
                    + Request New Promotion
                </button>
            </div>

            <div className="alert-banner">
                <span className="alert-icon">⚠️</span>
                <p>
                    <strong>Attention:</strong> All promotion requests are automatically and permanently deleted 60 days after they are created. Please ensure your payment is approved by the admin as soon as possible.
                </p>
            </div>

            <div className="card">
                {error && <p className="error-message">{error}</p>}
                {!error && promotions.length > 0 ? (
                    <>
                        {/* --- Desktop Table --- */}
                        <div className="desktop-table-wrapper">
                            <table className="content-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promotions.map(p => (
                                        <tr key={p.id}>
                                            <td className="product-cell">
                                                <img src={(JSON.parse(p.product_image_urls || '[]')[0]) || 'https://via.placeholder.com/50'} alt={p.product_title} />
                                                <span>{p.product_title}</span>
                                            </td>
                                            <td>{new Date(p.end_date).toLocaleDateString()}</td>
                                            <td>{renderPromoStatus(p.payment_status)}</td>
                                            <td className="actions-cell">
                                                {p.payment_status === 'approved_awaiting_payment' && (
                                                    <button className="btn btn-success" onClick={() => setIsPaymentModalOpen(true)}>
                                                        Pay Now
                                                    </button>
                                                )}
                                                <Link to={`/promotions/${p.id}`} className="btn btn-secondary">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Mobile Card List --- */}
                        <div className="mobile-promo-list">
                            {promotions.map(p => (
                                <PromotionCardMobile 
                                    key={p.id}
                                    promotion={p}
                                    renderStatus={renderPromoStatus}
                                    onPayNow={() => setIsPaymentModalOpen(true)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    !error && <div className="empty-state">
                        <h3>No Active Promotions</h3>
                        <p>Boost your sales by promoting your products on the homepage.</p>
                        <button className="btn btn-primary" onClick={() => setIsRequestModalOpen(true)}>
                            Request a Promotion
                        </button>
                    </div>
                )}
            </div>
            
            {isRequestModalOpen && (
                <PromotionRequestModal 
                    onClose={() => setIsRequestModalOpen(false)}
                    onSuccess={() => {
                        setIsRequestModalOpen(false);
                        fetchPromotions();
                    }}
                />
            )}

            {isPaymentModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsPaymentModalOpen(false)}>
                    <div className="modal-content" style={{maxWidth: '500px'}} onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsPaymentModalOpen(false)}>&times;</button>
                        <h2>Payment Instructions</h2>
                        <div className="payment-alert">
                            Please send the payment to one of the accounts below and **must message the admin with a screenshot** for approval.
                        </div>
                        <div className="payment-accounts">
                            <div className="payment-info-card">
                                <h4>JazzCash</h4>
                                <p><strong>Name:</strong> Azher Mehmood</p>
                                <p><strong>Number:</strong> 033495643002</p>
                            </div>
                            <div className="payment-info-card">
                                <h4>UPaisa</h4>
                                <p><strong>Name:</strong> Azher Mehmood</p>
                                <p><strong>Number:</strong> 03348846378</p>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;