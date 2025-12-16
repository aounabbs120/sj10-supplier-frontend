// src/pages/PrivacyPolicy.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

const PrivacyPolicy = ({ setIsLoading }) => {
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [setIsLoading]);

    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>Privacy Policy</h1>
                <Link to="/account" className="back-link">Back to Account</Link>
            </div>
            <div className="static-content">
                <p><strong>Last Updated:</strong> 14 December 2025</p>

                <h2>1. Introduction</h2>
                <p>SJ10 ("we," "our," or "us") is committed to protecting the privacy of our suppliers. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Supplier Panel. By using the platform, you agree to the collection and use of information in accordance with this policy.</p>

                <h2>2. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
                <ul>
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your full name, brand name, email address, contact number, and address that you voluntarily give to us when you register.</li>
                    <li><strong>Verification Data:</strong> To ensure the security and integrity of our marketplace, we require verification information. This may include your CNIC number, CNIC images (front and back), bank account details (name, account number, IBAN), and proof of bank account (screenshot or cheque image).</li>
                    <li><strong>Financial Data:</strong> Information related to your product sales, earnings, and withdrawal requests.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                <ul>
                    <li>Create and manage your supplier account.</li>
                    <li>Process your product listings and manage inventory.</li>
                    <li>Facilitate order fulfillment and communication between you and customers.</li>
                    <li><strong>Verify your identity and bank account details</strong> to prevent fraud and enable payouts.</li>
                    <li>Process payments and payouts to you.</li>
                    <li>Monitor and analyze usage and trends to improve your experience.</li>
                    <li>Notify you of updates to the platform.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                <h2>5. Disclosure of Your Information</h2>
                <p>We do not share, sell, rent, or trade your personal or verification information with third parties for their marketing purposes. Your information is used strictly for the operation of the SJ10 marketplace.</p>

                <h2>6. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at support@sj10.com.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;