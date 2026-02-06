import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const AboutUs = ({ setIsLoading }) => {
    const [activeSection, setActiveSection] = useState('mission');

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
        { id: 'mission', title: '1. Our Mission' },
        { id: 'founder', title: '2. Founder\'s Message' },
        { id: 'platform', title: '3. What is SJ10?' },
        { id: 'commitment', title: '4. Our Commitment' },
    ];

    return (
        <div className="legal-page-container">
            <div className="legal-hero-card legal-anim-fade-down">
                <h1 className="legal-main-title">About SJ10</h1>
                <p className="legal-sub-text">Empowering Pakistani Entrepreneurs to Sell Nationwide.</p>
                <Link to="/account" className="legal-back-btn">← Back to Account</Link>
            </div>

            <div className="legal-layout-wrapper">
                <aside className="legal-toc-sidebar legal-anim-slide-up">
                    <div className="legal-toc-card">
                        <div className="legal-toc-header">About Navigation</div>
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
                    <section id="mission" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🚀</span> 1. Our Mission</h2>
                        <p>In the vibrant landscape of Pakistani e-commerce, <strong>SJ10 (Saman Junction)</strong> was born from a powerful idea: to create a world-class marketplace that empowers local businesses. Our mission is to provide the tools, technology, and trust necessary for Pakistani suppliers to thrive in the digital age.</p>
                    </section>

                    <section id="founder" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🗣️</span> 2. A Word from Our Founder</h2>
                        <div style={{ fontStyle: 'italic', borderLeft: '4px solid #4f46e5', paddingLeft: '20px', margin: '20px 0', background: '#f9fafb', padding: '20px', borderRadius: '0 12px 12px 0' }}>
                            "I founded SJ10 with the belief that the heart of Pakistan's economy lies in its talented creators. For too long, accessing a national customer base has been complex. My goal with SJ10 is to break down those barriers. We are more than just a platform; we are a partner dedicated to your success."
                        </div>
                        <p><strong>— Mr. Aoun Abbas</strong>, Founder of SJ10</p>
                    </section>

                    <section id="platform" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🏢</span> 3. What is SJ10?</h2>
                        <p>SJ10 is a premier multi-vendor online marketplace, similar to Daraz or Markaz, but tailored specifically for high-quality suppliers. We connect you with customers across Pakistan, handling the technical platform while you focus on what you do best: selling great products.</p>
                    </section>

                    <section id="commitment" className="legal-section-block">
                        <h2 className="legal-section-heading"><span className="legal-icon-box">🤝</span> 4. Our Commitment</h2>
                        <p>We provide our suppliers with state-of-the-art tools to grow:</p>
                        <ul>
                            <li><strong>Live Order Tracking:</strong> Integration with Call Courier, PostEx, Leopards, and more.</li>
                            <li><strong>Secure Payments:</strong> Weekly payouts via Bank Transfer or JazzCash.</li>
                            <li><strong>Verification System:</strong> To ensure a trusted marketplace for everyone.</li>
                        </ul>
                        <p>Join us today and let's shape the future of Pakistani e-commerce together.</p>
                    </section>

                    <div className="legal-footer-note">
                        <p>SJ10 - Saman Junction | Established by Aoun Abbas</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AboutUs;