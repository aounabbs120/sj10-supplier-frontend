// src/pages/Tools.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Import the new PromotionsIcon along with the others
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

// The Tools component now accepts 'setIsLoading' to control the global loader
const Tools = ({ setIsLoading }) => {
    // This state prevents a "flash of unstyled content" while the loader is active.
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        // Show the loader when the component mounts
        setIsLoading(true);

        // Simulate a quick page load, then hide the loader.
        // This gives a consistent feel even for pages that don't fetch data.
        const timer = setTimeout(() => {
            setIsLoading(false);
            setPageLoading(false);
        }, 500); // Loader will show for 0.5 seconds

        // Cleanup the timer if the user navigates away quickly
        return () => clearTimeout(timer);
    }, [setIsLoading]);

    // While the page is "loading", we render nothing, and the global loader from App.js is visible.
    if (pageLoading) {
        return null;
    }

    // Once loading is complete, render the page content.
    return (
        <div className="tools-container">
            <h1 className="tools-header">Tools</h1>

            <div className="tool-card">
                <h2 className="tool-card-header">Basic Functions</h2>
                <div className="tool-card-content">
                    <ToolItem to="/products/add" icon={<AddIcon />} title="Add Products" colorClass="purple" />
                    <ToolItem to="/products" icon={<ProductsIcon />} title="Products" colorClass="orange" />
                    <ToolItem to="/orders" icon={<OrdersIcon />} title="Orders" colorClass="blue" />
                </div>
            </div>

            <div className="tool-card">
                <h2 className="tool-card-header">Features</h2>
                <div className="tool-card-content">
                    <ToolItem to="/reviews" icon={<ReviewsIcon />} title="Manage Reviews" isNew={true} colorClass="green" />
                    
                    {/* 2. This is the newly added line for the Promotions tool */}
                    <ToolItem to="/promotions" icon={<PromotionsIcon />} title="Promotions" isNew={true} colorClass="pink" />
                </div>
            </div>
        </div>
    );
};

export default Tools;