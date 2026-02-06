import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicy = ({ setIsLoading }) => {
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
        { id: 'collection', title: '2. Information We Collect' },
        { id: 'usage', title: '3. How We Use Data' },
        { id: 'security', title: '4. Data Security' },
        { id: 'sharing', title: '5. Third-Party Sharing' },
        { id: 'contact', title: '6. Contact Us' },
    ];

    return (
        <div className="legal-page-container">
            <div className="legal-hero-card legal-anim-fade-down">
                <h1 className="legal-main-title">Privacy Policy</h1>
                <p className="legal-sub-text">Your privacy is our priority. Learn how SJ10 protects your data.</p>
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
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🔒</span> 1. Introduction</h2>
                        <p><strong>SJ10 (Saman Junction)</strong> is committed to protecting the privacy of our suppliers. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Supplier Panel.</p>
                    </section>

                    <section id="collection" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">📂</span> 2. Information We Collect</h2>
                        <p>We collect the following types of data to operate our marketplace effectively:</p>
                        <ul>
                            <li><strong>Personal Identity:</strong> Full Name, Phone Number, Email Address.</li>
                            <li><strong>Verification Data:</strong> CNIC Number, CNIC Images (Front/Back) for identity proof.</li>
                            <li><strong>Financial Data:</strong> Bank Account Title, IBAN/Account Number, JazzCash/EasyPaisa details for payouts.</li>
                        </ul>
                    </section>

                    <section id="usage" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">⚙️</span> 3. How We Use Data</h2>
                        <p>Your data is used strictly for business operations, including:</p>
                        <ul>
                            <li>Verifying your identity to prevent fraud.</li>
                            <li>Processing your weekly payouts and earnings.</li>
                            <li>Facilitating order shipping and tracking.</li>
                            <li>Communicating platform updates and policy changes.</li>
                        </ul>
                    </section>

                    <section id="security" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🛡️</span> 4. Data Security</h2>
                        <p>We employ industry-standard encryption and security protocols to protect your sensitive information. Access to financial data is restricted to authorized personnel only.</p>
                    </section>

                    <section id="sharing" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🤝</span> 5. Third-Party Sharing</h2>
                        <p>We do <strong>not</strong> sell your personal data. However, we may share necessary details (like your pickup address) with our courier partners (Leopards, PostEx, etc.) solely for the purpose of fulfilling your orders.</p>
                    </section>

                    <section id="contact" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">📧</span> 6. Contact Us</h2>
                        <p>If you have any questions about your data privacy, please contact our support team at <strong>support@sj10.com</strong>.</p>
                    </section>

                    <div className="legal-footer-note">
                        <p>Last Updated: February 2026 | Approved by Aoun Abbas (Founder)</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrivacyPolicy;