/* src/pages/TermsConditions.js */

import React, { useEffect, useState } from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
    const [activeSection, setActiveSection] = useState('intro');

    // Smooth scroll handler
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // SEO Optimization: Set Page Title
    useEffect(() => {
        document.title = "Supplier Terms & Conditions | SJ10 - Saman Junction";
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        { id: 'intro', title: '1. Introduction' },
        { id: 'definitions', title: '2. Definitions' },
        { id: 'eligibility', title: '3. Supplier Eligibility' },
        { id: 'listings', title: '4. Product Listings & Quality' },
        { id: 'orders', title: '5. Orders & Fulfillment' },
        { id: 'payments', title: '6. Pricing, Fees & Payments' },
        { id: 'returns', title: '7. Returns & Refunds Policy' },
        { id: 'prohibited', title: '8. Prohibited Items' },
        { id: 'termination', title: '9. Account Termination' },
        { id: 'liability', title: '10. Limitation of Liability' },
        { id: 'law', title: '11. Governing Law' },
    ];

    return (
        <div className="terms-container">
            {/* SEO Meta Data Hidden */}
            <h1 style={{display: 'none'}}>SJ10 Supplier Terms and Conditions Pakistan</h1>
            <p style={{display: 'none'}}>The official supplier agreement for Saman Junction (SJ10), founded by Aoun Abbas. Read our selling policies, payment terms, and shipping guidelines for the Pakistani market.</p>

            <div className="terms-hero fade-in-down">
                <h1 className="terms-title">Terms & Conditions</h1>
                <p className="terms-subtitle">Please read these terms carefully before becoming a supplier on SJ10 (Saman Junction).</p>
            </div>

            <div className="terms-content-wrapper">
                {/* Sticky Table of Contents */}
                <aside className="toc-sidebar slide-in-up">
                    <div className="toc-card">
                        <div className="toc-title">Table of Contents</div>
                        <ul className="toc-list">
                            {sections.map(section => (
                                <li 
                                    key={section.id} 
                                    className={`toc-item ${activeSection === section.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    {section.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="terms-text-area">
                    
                    <section id="intro" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">📜</span> 1. Introduction</h2>
                        <p>Welcome to <strong>SJ10 (Saman Junction)</strong>. These Terms and Conditions ("Agreement") constitute a legally binding agreement between you ("Supplier", "Seller", "Vendor") and SJ10 ("We", "Us", "Platform"), founded by <strong>Mr. Aoun Abbas</strong>.</p>
                        <p>By registering as a supplier on the SJ10 panel, you acknowledge that you have read, understood, and agree to be bound by these terms. SJ10 operates as a multi-vendor marketplace in <strong>Pakistan</strong>, facilitating the sale of goods from suppliers to customers nationwide.</p>
                    </section>

                    <section id="definitions" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">📖</span> 2. Definitions</h2>
                        <ul>
                            <li><strong>"Platform"</strong> refers to the SJ10 website, mobile application, and supplier panel.</li>
                            <li><strong>"Supplier"</strong> refers to any business or individual registered to sell products on SJ10.</li>
                            <li><strong>"Customer"</strong> refers to the end-user purchasing products through SJ10.</li>
                            <li><strong>"Payout"</strong> refers to the earnings transferred to the Supplier after deductions of commissions and fees.</li>
                        </ul>
                    </section>

                    <section id="eligibility" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">✅</span> 3. Supplier Eligibility</h2>
                        <p>To use SJ10 as a supplier, you must:</p>
                        <ul>
                            <li>Be at least 18 years of age.</li>
                            <li>Operate a business located within <strong>Pakistan</strong>.</li>
                            <li>Provide a valid CNIC, Phone Number, and Bank Account/Mobile Wallet (JazzCash/EasyPaisa) details.</li>
                            <li>Have the legal capacity to enter into contracts under Pakistani law.</li>
                        </ul>
                    </section>

                    <section id="listings" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">🛍️</span> 4. Product Listings & Quality</h2>
                        <p>Suppliers are responsible for the accuracy of their product listings. All items must:</p>
                        <ul>
                            <li>Match the images and descriptions provided on the dashboard.</li>
                            <li>Be physically available in stock (inventory must be updated in real-time).</li>
                            <li><strong>Not be counterfeit:</strong> Selling fake or replica branding as "Original" is strictly prohibited and will lead to an immediate ban and legal action under intellectual property laws of Pakistan.</li>
                        </ul>
                    </section>

                    <section id="orders" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">📦</span> 5. Orders & Fulfillment</h2>
                        <p><strong>SLA (Service Level Agreement):</strong> Once an order is received, the Supplier must process and hand over the package to the courier partner within <strong>24 to 48 hours</strong>.</p>
                        <p><strong>Packaging:</strong> Products must be packed securely to prevent damage during transit. SJ10 is not liable for items damaged due to poor packaging by the supplier.</p>
                        <p><strong>Cancellations:</strong> Frequent order cancellations due to "Out of Stock" status may result in a penalty or account downgrading.</p>
                    </section>

                    <section id="payments" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">💰</span> 6. Pricing, Fees & Payments</h2>
                        <p><strong>Commission:</strong> SJ10 charges a fixed commission or percentage per sale, which is transparently displayed in your dashboard.</p>
                        <p><strong>Payout Cycle:</strong> Earnings are calculated based on <em>Delivered</em> orders. Payouts are processed weekly (or as per current policy) via Bank Transfer, JazzCash, or EasyPaisa.</p>
                        <p><strong>Deductions:</strong> Shipping charges (if applicable) and return penalties may be deducted from the final payout.</p>
                    </section>

                    <section id="returns" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">↩️</span> 7. Returns & Refunds Policy</h2>
                        <p>SJ10 complies with Pakistani consumer protection laws. Customers have the right to return products if they are:</p>
                        <ul>
                            <li>Damaged or Defective upon arrival.</li>
                            <li>Incorrect item sent (wrong size, color, or model).</li>
                            <li>Counterfeit or not matching the description.</li>
                        </ul>
                        <p><strong>Return Dispute:</strong> If a customer returns a product, the Supplier will be notified. If the return is valid, the cost of the product and shipping will be borne by the Supplier.</p>
                    </section>

                    <section id="prohibited" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">🚫</span> 8. Prohibited Items</h2>
                        <p>You strictly cannot sell:</p>
                        <ul>
                            <li>Weapons, firearms, or ammunition.</li>
                            <li>Narcotics, drugs, or illegal substances.</li>
                            <li>Adult/pornographic content.</li>
                            <li>Stolen goods.</li>
                            <li>Items prohibited by the Government of Pakistan.</li>
                        </ul>
                    </section>

                    <section id="termination" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">🔒</span> 9. Account Termination</h2>
                        <p>SJ10 reserves the right to suspend or terminate your supplier account if:</p>
                        <ul>
                            <li>You breach any terms of this Agreement.</li>
                            <li>Your Return Rate exceeds the acceptable threshold (e.g., &gt;10%).</li>
                            <li>You engage in fraudulent activities, such as self-ordering to boost ratings.</li>
                        </ul>
                    </section>

                    <section id="liability" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">⚖️</span> 10. Limitation of Liability</h2>
                        <p>SJ10 is a marketplace venue. We are not the manufacturer of the goods. SJ10 shall not be liable for any indirect, incidental, or consequential damages arising from the sale of products on the platform.</p>
                    </section>

                    <section id="law" className="terms-section">
                        <h2 className="section-title"><span className="section-icon">🏛️</span> 11. Governing Law</h2>
                        <p>This Agreement shall be governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>. Any disputes arising out of this agreement shall be subject to the exclusive jurisdiction of the courts in Pakistan.</p>
                    </section>

                    <div className="last-updated">
                        <p>Last Updated: February 2026 | Approved by Aoun Abbas (Founder)</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TermsConditions;