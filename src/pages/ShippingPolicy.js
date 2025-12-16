// src/pages/ShippingPolicy.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

const ShippingPolicy = ({ setIsLoading }) => {
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [setIsLoading]);

    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>Shipping Policy</h1>
                <Link to="/account" className="back-link">Back to Account</Link>
            </div>
            <div className="static-content">
                <p><strong>Last Updated:</strong> 14 December 2025</p>
                <p>Welcome to the SJ10 Supplier Platform. This Shipping Policy outlines the responsibilities and procedures for our valued suppliers regarding the shipment of orders placed through our marketplace.</p>

                <h2>Our Marketplace Model</h2>
                <p>SJ10 operates as a multi-vendor marketplace, connecting talented suppliers like you with customers across Pakistan. As a supplier on our platform, you are in control of your inventory, and you are responsible for shipping your products directly to the customer.</p>
                
                <h2>Supplier Responsibilities</h2>
                <ul>
                    <li><strong>Order Fulfillment:</strong> You are responsible for processing, packaging, and dispatching all orders for your products in a timely and professional manner.</li>
                    <li><strong>Packaging:</strong> All items must be securely packaged to prevent damage during transit. We recommend using high-quality materials to ensure a positive customer experience.</li>
                    <li><strong>Shipping Carrier:</strong> You are free to use any reputable local courier service in Pakistan (e.g., Leopards, TCS, M&P, etc.) to ship your orders.</li>
                </ul>

                <h2>The Shipping Process on SJ10</h2>
                <ol>
                    <li><strong>Receive Order:</strong> When a customer places an order for one of your products, it will appear in the "Manage Orders" section of your Supplier Dashboard.</li>
                    <li><strong>Dispatch Order:</strong> After you have packaged the order and handed it over to your chosen courier, you will receive a tracking number.</li>
                    <li><strong>Update on Platform:</strong> You must then log in to your SJ10 dashboard, find the relevant order, and submit the tracking number and the courier's name. This action marks the order as "Dispatched."</li>
                    <li><strong>Automated Tracking:</strong> Once the tracking number is submitted, our system, powered by Track123, will automatically provide real-time tracking updates to both you and the customer.</li>
                </ol>

                <h2>Timeliness</h2>
                <p>We encourage our suppliers to dispatch orders within 48 hours of receiving them to ensure customer satisfaction. Consistent and prompt shipping is a key factor in maintaining a good seller rating on our platform.</p>

                <h2>Contact & Support</h2>
                <p>If you have any questions about this shipping policy or the order fulfillment process, please do not hesitate to contact the SJ10 Admin team through the support channels provided.</p>
                <p>Thank you for being a part of the SJ10 community.</p>
                <p><em>- Aoun Abbas, Founder of SJ10</em></p>
            </div>
        </div>
    );
};

export default ShippingPolicy;