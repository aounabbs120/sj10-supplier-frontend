// src/pages/Tools.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import { AddIcon, ProductsIcon, OrdersIcon, ReviewsIcon, PromotionsIcon } from '../components/Icons';
import './Tools.css';

const ToolItem = ({ to, icon, title, isNew = false, colorClass = '', ariaLabel }) => (
    <Link to={to} className="tool-item" aria-label={ariaLabel || title}>
        <div className={`tool-icon-wrapper ${colorClass}`}>
            {icon}
            {isNew && <span className="new-badge">New</span>}
        </div>
        <span className="tool-title">{title}</span>
    </Link>
);

const Tools = ({ setIsLoading }) => {
    // 🟢 SWR CACHING: Instant pre-population from LocalStorage to bypass network wait time
    const [unreadOrdersCount, setUnreadOrdersCount] = useState(() => {
        const cached = localStorage.getItem('swr_unread_orders_count');
        return cached ? parseInt(cached, 10) : 0;
    });
    
    // Page load is instant if cached count exists
    const [pageLoading, setPageLoading] = useState(!localStorage.getItem('swr_unread_orders_count'));

    useEffect(() => {
        // --- 🟢 SEO OPTIMIZATION ---
        document.title = "Supplier Control Center - SJ10 Marketplace";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage products, track orders, check reviews, and promote listings instantly inside SJ10 Marketplace Seller Tools.");
        }

        // Silent background fetch to prevent page locking
        if (allOrdersExistInCache()) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }

        supplierService.getMyOrders().then(orders => {
            const unread = orders.filter(o => o.shipment_details?.is_new).length;
            setUnreadOrdersCount(unread);
            // Save fresh count for next instant loading
            localStorage.setItem('swr_unread_orders_count', String(unread));
        }).catch(err => {
            console.error("Failed to sync unread orders:", err);
        }).finally(() => {
            setIsLoading(false);
            setPageLoading(false);
        });

    }, [setIsLoading]);

    // Helper to check if initial orders exist
    const allOrdersExistInCache = () => {
        return !!localStorage.getItem('swr_all_orders');
    };

    if (pageLoading && unreadOrdersCount === 0) {
        return (
            <div className="tools-loading-screen">
                <div className="tools-spinner"></div>
                <p>Loading Tools Dashboard...</p>
            </div>
        );
    }

    return (
        <main className="tools-container">
            <header>
                <h1 className="tools-header">Control Center</h1>
            </header>

            {/* Basic Functions Section */}
            <section className="tool-card" aria-labelledby="basic-fn-heading">
                <h2 id="basic-fn-heading" className="tool-card-header">Basic Functions</h2>
                <div className="tool-card-content">
                    <ToolItem 
                        to="/products/add" 
                        icon={<AddIcon />} 
                        title="Add Products" 
                        colorClass="purple" 
                        ariaLabel="Add new products to your SJ10 store"
                    />
                    <ToolItem 
                        to="/products" 
                        icon={<ProductsIcon />} 
                        title="Products" 
                        colorClass="orange" 
                        ariaLabel="Manage listed products"
                    />
                    <ToolItem 
                        to="/orders" 
                        icon={<OrdersIcon />} 
                        title="Orders" 
                        colorClass="blue" 
                        isNew={unreadOrdersCount > 0} 
                        ariaLabel={`View orders. ${unreadOrdersCount} new orders awaiting.`}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="tool-card" aria-labelledby="features-heading">
                <h2 id="features-heading" className="tool-card-header">Marketing & Reviews</h2>
                <div className="tool-card-content">
                    <ToolItem 
                        to="/reviews" 
                        icon={<ReviewsIcon />} 
                        title="Manage Reviews" 
                        colorClass="green" 
                        ariaLabel="View customer reviews and feedback"
                    />
                    <ToolItem 
                        to="/promotions" 
                        icon={<PromotionsIcon />} 
                        title="Promotions" 
                        colorClass="pink" 
                        ariaLabel="Create campaign promotions for higher sales"
                    />
                </div>
            </section>
        </main>
    );
};

export default Tools;