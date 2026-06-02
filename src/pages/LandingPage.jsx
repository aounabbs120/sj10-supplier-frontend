// src/pages/LandingPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
    ShoppingBag, ShieldCheck, Truck, Zap, ArrowRight, 
    CheckCircle, Globe, Smartphone, TrendingUp, DollarSign, 
    Users, RefreshCw, Award, Target, Star, PlayCircle, MapPin
} from 'lucide-react';
import './LandingPage.css';

// 🟢 Reusable Animated Counter Component (Counts from 0 to target number)
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (inView) {
            let start = null;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / (duration * 1000), 1);
                // Ease out Expo formula for smooth deceleration
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                setCount(Math.floor(easeOut * (to - from) + from));
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [inView, from, to, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const LandingPage = () => {
    const navigate = useNavigate();

    // 🟢 DEEP SEO OPTIMIZATION: Advanced Meta Tags & JSON-LD Schema
    useEffect(() => {
        document.title = "SJ10 Seller Center | #1 Wholesale B2B E-commerce & Dropshipping Platform Pakistan";
        
        // Setup Meta Tags
        const setMetaTag = (name, content, isProperty = false) => {
            let meta = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (isProperty) meta.setAttribute('property', name);
                else meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        setMetaTag("description", "Register your wholesale shop on SJ10 Seller Center. Let 100,000+ sj10.pk dropshippers make your products viral. Get automated COD orders, fast payouts with zero investment. The ultimate Daraz alternative for wholesalers.");
        setMetaTag("keywords", "SJ10 Seller Center, Sell on SJ10, Wholesale Market Pakistan, Dropshipping Pakistan, Earn Money Online, Zero Investment Business, Viral E-commerce, B2B Pakistan, Reseller Network, COD Delivery");
        setMetaTag("og:title", "SJ10 Seller Center | Viral Wholesale Business", true);
        setMetaTag("og:description", "Automate your wholesale business. Get thousands of orders via 100,000+ marketers.", true);
        setMetaTag("og:type", "website", true);
        setMetaTag("robots", "index, follow");

        // Inject JSON-LD Structured Data for Google Rich Results
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SJ10 Seller Center",
            "url": "https://seller.sj10.pk",
            "logo": "https://seller.sj10.pk/logo.gif",
            "description": "Pakistan's leading B2B wholesale and dropshipping platform connecting suppliers to marketers.",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK",
                "addressLocality": "RWP",
            }
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // --- 🎭 BEAUTIFUL FRAMER MOTION ANIMATION VARIANTS ---
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
    };

    // 🔁 Continuous Loop Animations
    const floatLoop = {
        animate: { y: [0, -20, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
    };

    const pulseLoop = {
        animate: {
            scale: [1, 1.03, 1],
            boxShadow: [
                "0 8px 25px rgba(249, 115, 22, 0.35)", 
                "0 12px 35px rgba(249, 115, 22, 0.6)", 
                "0 8px 25px rgba(249, 115, 22, 0.35)"
            ],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
    };

    const rotateLoop = {
        animate: { rotate: 360 },
        transition: { duration: 20, repeat: Infinity, ease: "linear" }
    };

    return (
        <div className="landing-page-wrapper">
            
            {/* --- 1. PREMIUM GLASSMORPHIC NAVBAR --- */}
            <nav className="landing-navbar">
                <motion.div className="nav-brand-group" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <img src="/logo.gif" alt="SJ10 Logo" className="navbar-logo-gif" />
                    <div className="nav-brand">
                        <span className="logo-bold">SJ10</span>
                        <span className="logo-light">SELLER CENTER</span>
                    </div>
                </motion.div>
                <motion.div className="nav-actions" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <button className="btn-nav-link" onClick={() => navigate('/login')}>Login Portal</button>
                    <motion.button 
                        className="btn-nav-primary" 
                        onClick={() => navigate('/register')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Register Free Shop
                    </motion.button>
                </motion.div>
            </nav>

            {/* --- 2. MASSIVE HERO SECTION --- */}
            <header className="landing-hero-section">
                <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div className="hero-badge" variants={fadeInUp}>
                        <span className="live-dot-pulse"></span>
                        <span>Link your shop directly to sj10.pk Reseller App</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeInUp}>
                        Automate Your Wholesale Business & Go <span className="text-orange">VIRAL</span> 🚀
                    </motion.h1>
                    
                    <motion.p variants={fadeInUp} className="hero-subtitle">
                        Start your online business journey with <strong>SJ10 Seller Center</strong>. List your clothes, cosmetics, or electronics for free. Our smart platform connects your catalog with <strong>100,000+ dropshippers</strong> on sj10.pk who market your items on TikTok & WhatsApp. Get massive automated orders with <strong>Zero Investment</strong>!
                    </motion.p>
                    
                    <motion.div className="hero-cta-group" variants={fadeInUp}>
                        <motion.button 
                            className="btn-hero-primary-loop" 
                            onClick={() => navigate('/register')}
                            {...pulseLoop}
                        >
                            Start Getting Orders <ArrowRight size={20} />
                        </motion.button>
                        <div className="hero-trust-list">
                            <span><CheckCircle size={20} color="#f97316"/> No Setup Fee</span>
                            <span><CheckCircle size={20} color="#f97316"/> COD Delivery Setup</span>
                            <span><CheckCircle size={20} color="#f97316"/> Nationwide Reach</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Hero Floating Visuals */}
                <div className="hero-visuals">
                    <motion.div className="hero-image-wrapper" {...floatLoop}>
                        <img src="https://pub-b132cda8c8fb4e9391c446ca11a5f484.r2.dev/ecommerce/products/TEMP-SKU/20260602084817-o05x8d.webp" alt="SJ10 Dashboard" className="hero-main-img" />
                        <motion.div className="rotating-deco" {...rotateLoop}></motion.div>
                    </motion.div>
                    
                    <motion.div className="floating-card c-one" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                        <TrendingUp size={36} color="#f97316" />
                        <div><h4>Viral Reach</h4><p>Millions of Views</p></div>
                    </motion.div>
                    
                    <motion.div className="floating-card c-two" animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                        <Users size={36} color="#1e3a8a" />
                        <div><h4>Active Resellers</h4><p>Selling for you 24/7</p></div>
                    </motion.div>
                </div>
            </header>

            {/* --- 3. ANIMATED STATS BAR (0 TO TARGET COUNTERS) --- */}
            <motion.section className="landing-stats-bar" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
                <motion.div className="stat-item" variants={fadeInUp}>
                    <h2><AnimatedCounter from={0} to={100} duration={2.5} suffix="K+" /></h2>
                    <p>sj10.pk Marketers</p>
                </motion.div>
                <div className="stat-divider"></div>
                {/* 🟢 Updated from 2M to 1000+ Orders Delivered */}
                <motion.div className="stat-item" variants={fadeInUp}>
                    <h2><AnimatedCounter from={0} to={1000} duration={3} suffix="+" /></h2>
                    <p>Orders Delivered</p>
                </motion.div>
                <div className="stat-divider"></div>
                <motion.div className="stat-item" variants={fadeInUp}>
                    <h2><AnimatedCounter from={0} to={100} duration={2} suffix="%" /></h2>
                    <p>Automated Payouts</p>
                </motion.div>
            </motion.section>

            {/* --- 4. DETAILED "ORDER GETTING" ENGINE EXPLAINED --- */}
            <section className="landing-order-engine" id="how-it-works">
                <div className="section-header-centered">
                    <h2>How We Get You Unlimited Orders</h2>
                    <p>Aapko khud marketing karne ki zaroorat nahi. SJ10 ka smart system aapki products ko viral karta hai. Dekhein yeh system kaise kam karta hai:</p>
                </div>

                <div className="order-engine-grid">
                    <motion.div className="engine-visual-side" initial="hidden" whileInView="visible" variants={fadeInLeft} viewport={{ once: true, margin: "-100px" }}>
                        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Order Dashboard" className="detailed-engine-img" />
                        
                        <motion.div className="live-sales-notification" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <div className="live-pulse"></div>
                            <div>
                                <strong>New Viral Order!</strong>
                                <span>3x Ladies Unstitched Suits</span>
                            </div>
                            <h4 className="text-orange">PKR 7,500</h4>
                        </motion.div>
                    </motion.div>

                    <motion.div className="engine-text-side" initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, margin: "-100px" }}>
                        <motion.div className="step-card" variants={fadeInUp}>
                            <div className="step-num">1</div>
                            <div className="step-info">
                                <h3>List & Forget (Zero Cost)</h3>
                                <p>Aap sirf apni wholesale products (kapre, joote, electronics) SJ10 Seller Center par upload karein aur apna wholesale rate set karein.</p>
                            </div>
                        </motion.div>
                        <motion.div className="step-card" variants={fadeInUp}>
                            <div className="step-num">2</div>
                            <div className="step-info">
                                <h3>Instant sj10.pk Broadcast</h3>
                                <p>List karte hi aapki product hamari dusri app <strong>sj10.pk</strong> par lakhon resellers (dropshippers) ko nazar aana shuru ho jati hai.</p>
                            </div>
                        </motion.div>
                        <motion.div className="step-card" variants={fadeInUp}>
                            <div className="step-num">3</div>
                            <div className="step-info">
                                <h3>Viral Marketing on TikTok/WhatsApp</h3>
                                <p>Resellers aapki product pictures par apna profit rakh kar WhatsApp groups aur TikTok par share karte hain. Viral hone par hazaron orders generate hote hain.</p>
                            </div>
                        </motion.div>
                        <motion.div className="step-card" variants={fadeInUp}>
                            <div className="step-num">4</div>
                            <div className="step-info">
                                <h3>Pack & Dispatch (COD)</h3>
                                <p>Order aate hi aapke panel mein notification aati hai. Aap parcel pack karte hain aur hamara courier aakar parcel le jata hai. Cash collection hum karte hain!</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- 5. MASSIVE BENEFITS GRID WITH IMAGES --- */}
            <section className="landing-benefits-section">
                <div className="section-header-centered">
                    <h2>Advanced E-Commerce Benefits</h2>
                    <p>Designed deeply for Pakistani wholesalers. Zero technical knowledge required, just pure business growth and scale.</p>
                </div>

                <motion.div className="benefits-detailed-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <motion.div className="benefit-large-card" variants={fadeInUp}>
                        <img src="https://pub-b132cda8c8fb4e9391c446ca11a5f484.r2.dev/ecommerce/products/TEMP-SKU/20260602083330-i84k5j.webp" alt="Doorstep Courier" />
                        <div className="benefit-content">
                            <div className="b-icon"><Truck /></div>
                            <h3>Doorstep Courier Network</h3>
                            <p>Aapko courier office jane ki zaroorat nahi. 1-click se rider aapke warehouse aakar parcel pick karega. Har parcel automatically track hota hai.</p>
                        </div>
                    </motion.div>

                    <motion.div className="benefit-large-card" variants={fadeInUp}>
                        <img src="https://pub-b132cda8c8fb4e9391c446ca11a5f484.r2.dev/ecommerce/products/TEMP-SKU/20260602083342-sw32mr.webp" alt="Fast Payouts" />
                        <div className="benefit-content">
                            <div className="b-icon"><DollarSign /></div>
                            <h3>Fast COD Payouts (Bank/JazzCash)</h3>
                            <p>Cash on Delivery (COD) ki amount safe hai. Deliver hone wale parcels ki payment har hafte automatically aapke Bank, JazzCash, ya EasyPaisa mein transfer hogi.</p>
                        </div>
                    </motion.div>

                    <motion.div className="benefit-large-card" variants={fadeInUp}>
                        <img src="https://pub-b132cda8c8fb4e9391c446ca11a5f484.r2.dev/ecommerce/products/TEMP-SKU/20260602083840-nbnkun.webp" alt="Gold Supplier Badge" />
                        <div className="benefit-content">
                            <div className="b-icon"><ShieldCheck /></div>
                            <h3>Gold Supplier Trust Badge</h3>
                            <p>Apna CNIC aur business details verify karwa kar Gold Badge hasil karein. Gold suppliers ki products top par rank hoti hain, jis se sale 10x ho jati hai.</p>
                        </div>
                    </motion.div>

                    <motion.div className="benefit-large-card" variants={fadeInUp}>
                        <img src="https://pub-b132cda8c8fb4e9391c446ca11a5f484.r2.dev/ecommerce/products/TEMP-SKU/20260602084029-h6lid.webp" alt="Pan-Pakistan Reach" />
                        <div className="benefit-content">
                            <div className="b-icon"><Globe /></div>
                            <h3>Pan-Pakistan Order Fulfillment</h3>
                            <p>Ghar baithy pooray Pakistan mein apni products bechein. Karachi se Kashmir tak, hamara reseller network aur delivery system aapke business ko scale karta hai.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* --- 6. HUGE CALL TO ACTION BANNER --- */}
            <section className="animated-banner-section">
                <motion.div 
                    className="banner-content-deep"
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
                >
                    <div className="banner-overlay-pattern"></div>
                    <motion.div className="banner-text-content" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                        <h2>Don't Wait for Customers.<br/>Let Them Sell For You!</h2>
                        <p>Join thousands of successful wholesalers in Pakistan earning massive profits through the SJ10 Seller Center ecosystem. Registration takes only 2 minutes.</p>
                        <motion.button 
                            className="btn-banner-massive-glow"
                            onClick={() => navigate('/register')}
                        >
                            Open Your Free Wholesale Shop
                        </motion.button>
                    </motion.div>
                </motion.div>
            </section>

            {/* --- 7. DEEP MODERN FOOTER (WITH REAL PAGES & ICONS) --- */}
            <footer className="landing-footer-modern">
                <div className="footer-top-grid">
                    <div className="footer-brand-col">
                        <div className="footer-logo">
                            <img src="/logo.gif" alt="SJ10" className="footer-logo-img"/>
                            <span className="logo-bold">SJ10</span>
                            <span className="logo-light">SELLER CENTER</span>
                        </div>
                        <p>Pakistan's most powerful B2B wholesale platform. We connect high-quality suppliers directly to the <strong>sj10.pk</strong> viral dropshipping network. Earn money from home securely.</p>
                        <div className="footer-contact-info">
                            <span><MapPin size={18}/> Head Office, chakwal, Pakistan</span>
                            <span><Smartphone size={18}/> Support: +92 334884678</span>
                        </div>
                    </div>
                    
                    <div className="footer-links-col">
                        <h4>Platform Ecosystem</h4>
                        <Link to="/login">Seller Portal Login</Link>
                        <Link to="/register">Register New Shop</Link>
                        {/* 🟢 About Us Link Added Here */}
                        <Link to="/about-us">About Us</Link>
                        <a href="https://sj10.pk" target="_blank" rel="noreferrer">Visit sj10.pk Reseller App</a>
                    </div>
                    
                    <div className="footer-links-col">
                        <h4>Legal & Trust</h4>
                        {/* 🟢 Privacy Policy, Shipping Policy, Terms & Conditions Links Added Here */}
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/shipping-policy">Shipping Policy</Link>
                        <Link to="/terms-conditions">Terms & Conditions</Link>
                        <a href="mailto:support@sj10.pk">Supplier Helpdesk</a>
                    </div>
                </div>
                
                <div className="footer-bottom-divider"></div>
                
                <div className="footer-copyright-row">
                    <p>&copy; {new Date().getFullYear()} SJ10 Marketplace & Dropshipping Ecosystem. All rights reserved. 🇵🇰</p>
                    
                    {/* 🟢 BEAUTIFUL LOOP ANIMATED PAYMENT & WALLET ICONS IN FOOTER */}
                    <motion.div 
                        className="payment-icons-container"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img src="data:image/png;base64,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" alt="Visa" className="pay-icon"/>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="pay-icon"/>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="pay-icon"/>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmBdqdNfo3NfVWn0GULI6-lJI4fm-AkzKAkQ&s=10" alt="JazzCash" className="pay-icon tall-icon"/>
                        <img src="https://icon2.cleanpng.com/lnd/20250110/er/acded9d6362d497965c18a071cb9fd.webp" alt="EasyPaisa" className="pay-icon tall-icon"/>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;