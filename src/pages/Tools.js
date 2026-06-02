// src/pages/Tools.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import { AddIcon, ProductsIcon, OrdersIcon, ReviewsIcon, PromotionsIcon } from '../components/Icons';
import './Tools.css';

const ToolItem = ({ to, icon, title, isNew = false, colorClass = '' }) => (
    <Link to={to} className="tool-item">
        <div className={`tool-icon-wrapper ${colorClass}`}>
            {icon}
            {isNew && <span className="new-badge">New</span>}
        </div>
        <span className="tool-title">{title}</span>
    </Link>
);

const Tools = ({ setIsLoading }) => {
    const [pageLoading, setPageLoading] = useState(true);
    const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);

        // 🟢 Fetch Orders to check for Unread (is_seen === 0)
        supplierService.getMyOrders().then(orders => {
            const unread = orders.filter(o => o.shipment_details?.is_new).length;
            setUnreadOrdersCount(unread);
        }).catch(err => {
            console.error("Failed to fetch unread orders:", err);
        }).finally(() => {
            setIsLoading(false);
            setPageLoading(false);
        });

    }, [setIsLoading]);

    if (pageLoading) return null;

    return (
        <div className="tools-container">
            <h1 className="tools-header">Tools</h1>

            <div className="tool-card">
                <h2 className="tool-card-header">Basic Functions</h2>
                <div className="tool-card-content">
                    <ToolItem to="/products/add" icon={<AddIcon />} title="Add Products" colorClass="purple" />
                    <ToolItem to="/products" icon={<ProductsIcon />} title="Products" colorClass="orange" />
                    
                    {/* 🟢 NEW BADGE LOGIC APPLIED HERE */}
                    <ToolItem to="/orders" icon={<OrdersIcon />} title="Orders" colorClass="blue" isNew={unreadOrdersCount > 0} />
                </div>
            </div>

            <div className="tool-card">
                <h2 className="tool-card-header">Features</h2>
                <div className="tool-card-content">
                    <ToolItem to="/reviews" icon={<ReviewsIcon />} title="Manage Reviews" colorClass="green" />
                    <ToolItem to="/promotions" icon={<PromotionsIcon />} title="Promotions" colorClass="pink" />
                </div>
            </div>
        </div>
    );
};

export default Tools;