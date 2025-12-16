// src/pages/AboutUs.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

const AboutUs = ({ setIsLoading }) => {
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [setIsLoading]);

    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>About SJ10</h1>
                <Link to="/account" className="back-link">Back to Account</Link>
            </div>
            <div className="static-content">
                <h2>Our Mission: Empowering Pakistani Entrepreneurs</h2>
                <p>In the vibrant and dynamic landscape of Pakistani e-commerce, SJ10 was born from a simple yet powerful idea: to create a world-class online marketplace that truly empowers local businesses, artisans, and suppliers. Our mission is to provide the tools, technology, and trust necessary for Pakistani entrepreneurs to thrive in the digital age.</p>

                <h2>A Word from Our Founder</h2>
                <p><em>"I founded SJ10 with the belief that the heart of Pakistan's economy lies in its talented creators and business owners. For too long, accessing a national customer base has been a complex challenge. My goal, with SJ10, is to break down those barriers. We are more than just a platform; we are a partner dedicated to the growth and success of every supplier who joins us."</em></p>
                <p><strong>- Aoun Abbas, Founder of SJ10</strong></p>

                <h2>What is SJ10?</h2>
                <p>SJ10 is a premier multi-vendor online marketplace designed for the unique needs of the Pakistani market. We provide a seamless, secure, and sophisticated platform where suppliers can showcase their products to a wide audience of customers who are looking for quality and authenticity.</p>

                <h2>Our Commitment to Suppliers</h2>
                <p>We understand that our success is tied to yours. That's why we've built our Supplier Panel from the ground up to be powerful yet intuitive. We provide you with:</p>
                <ul>
                    <li>Easy product and inventory management.</li>
                    <li>A streamlined order fulfillment system with automated tracking.</li>
                    <li>Tools to boost your visibility, such as product promotions.</li>
                    <li>A secure verification system to build customer trust.</li>
                    <li>Transparent analytics to help you grow your business.</li>
                </ul>

                <h2>Join Us on Our Journey</h2>
                <p>Whether you are an established brand or a budding entrepreneur, SJ10 is your platform to connect, sell, and succeed. We are proud to be a Pakistani company building for Pakistan. Join our community today and let's shape the future of e-commerce together.</p>
            </div>
        </div>
    );
};

export default AboutUs;