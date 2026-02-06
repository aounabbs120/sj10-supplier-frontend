import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const ShippingPolicy = ({ setIsLoading }) => {
    const [activeSection, setActiveSection] = useState('intro');

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
        window.scrollTo(0, 0);
    }, [setIsLoading]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const sections = [
        { id: 'intro', title: '1. Introduction' },
        { id: 'model', title: '2. Self-Fulfillment Model' },
        { id: 'couriers', title: '3. Supported Couriers' },
        { id: 'tracking', title: '4. Tracking Process' },
        { id: 'warranty', title: '5. 7-Day Return Warranty' },
        { id: 'packaging', title: '6. Packaging Guidelines' },
    ];

    return (
        <div className="legal-page-container">
            <div className="legal-hero-card legal-anim-fade-down">
                <h1 className="legal-main-title">Shipping Policy</h1>
                <p className="legal-sub-text">Understand how to fulfill, ship, and track orders on SJ10.</p>
                <Link to="/account" className="legal-back-btn">← Back to Account</Link>
            </div>

            <div className="legal-layout-wrapper">
                <aside className="legal-toc-sidebar legal-anim-slide-up">
                    <div className="legal-toc-card">
                        <div className="legal-toc-header">Table of Contents</div>
                        <ul className="legal-toc-list">
                            {sections.map(section => (
                                <li key={section.id} className={`legal-toc-item ${activeSection === section.id ? 'active-item' : ''}`} onClick={() => scrollToSection(section.id)}>
                                    {section.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="legal-content-area">
                    <section id="intro" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🚚</span> 1. Introduction</h2>
                        <p>Welcome to the <strong>SJ10 Shipping Policy</strong>. As a multi-vendor marketplace operating in Pakistan, we aim to provide the fastest and most reliable delivery experience. This policy outlines the obligations for suppliers regarding order fulfillment.</p>
                    </section>

                    <section id="model" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">📦</span> 2. Self-Fulfillment Model</h2>
                        <p>SJ10 operates on a <strong>Self-Fulfillment</strong> basis. This means:</p>
                        <ul>
                            <li>You (the Supplier) keep your own stock.</li>
                            <li>You are responsible for packing and handing over the parcel to the courier.</li>
                            <li>You maintain control over your inventory speed and quality.</li>
                        </ul>
                    </section>

                    <section id="couriers" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🏢</span> 3. Supported Couriers</h2>
                        <p>To ensure real-time tracking integration with our system, we support the following major courier services in Pakistan. You must use one of these providers:</p>
                        <ul>
                            <li><strong>Leopards Courier</strong></li>
                            <li><strong>PostEx</strong></li>
                            <li><strong>Trax / Call Courier</strong></li>
                            <li><strong>Swift</strong></li>
                            <li><strong>DHL</strong> (For high-value or specific items)</li>
                            <li><strong>TCS</strong></li>
                        </ul>
                    </section>

                    <section id="tracking" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">📲</span> 4. The Tracking Process</h2>
                        <p>Our system offers <strong>Live Tracking</strong> integration. Here is the mandatory workflow:</p>
                        <ol>
                            <li><strong>Receive Order:</strong> You get a notification in your SJ10 Dashboard.</li>
                            <li><strong>Ship Item:</strong> Book the shipment with your chosen courier (e.g., Leopards) and get the <strong>Tracking Number (CN Number)</strong>.</li>
                            <li><strong>Input Data:</strong> Go to the "Orders" page on SJ10, click "Fulfill", and enter the Tracking Number and Courier Name in the input fields.</li>
                            <li><strong>Live Updates:</strong> Once saved, our system automatically connects with the courier's API. The customer will receive live notifications (SMS/Email) regarding their parcel's location.</li>
                        </ol>
                    </section>

                    <section id="warranty" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🛡️</span> 5. 7-Day Return Warranty</h2>
                        <p>SJ10 mandates a <strong>7-Day Return Warranty</strong> on all products to build customer trust. If a customer receives a damaged, incorrect, or faulty item, they have the right to claim a return within 7 days of delivery.</p>
                        <p>Suppliers must honor this warranty. Failure to accept valid returns may lead to account penalties.</p>
                    </section>

                    <section id="packaging" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🎁</span> 6. Packaging Guidelines</h2>
                        <p>Products must be packed securely using bubble wrap and flyer bags to prevent damage. SJ10 is not liable for damages caused by poor packaging during transit.</p>
                    </section>

                    <div className="legal-footer-note">
                        <p>Last Updated: February 2026 | Approved by Aoun Abbas (Founder)</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ShippingPolicy;