import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { motion } from 'framer-motion';
import './AuthStyles.css';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) navigate('/login');
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling) element.nextSibling.focus();
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            await authService.verifyEmail(email, otp.join(''));
            alert("Verification Successful!");
            navigate('/login');
        } catch (err) {
            alert("Invalid OTP, please try again.");
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="auth-card">
                <div style={{fontSize: '50px'}}>📧</div>
                <h1 className="auth-title">Verify Your Email</h1>
                <p className="auth-subtitle">We sent a 6-digit code to <b>{email}</b></p>

                <div className="otp-container">
                    {otp.map((data, index) => (
                        <input
                            className="otp-box"
                            type="text"
                            maxLength="1"
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                <button className="btn-auth-primary" onClick={handleVerify} disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Activate Account"}
                </button>

                <p className="auth-footer-link">
                    Didn't get the code? <a href="#" onClick={() => window.location.reload()}>Resend</a>
                </p>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;