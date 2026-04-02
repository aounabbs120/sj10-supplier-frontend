// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Beautiful Icons
import { 
  FaEnvelope, FaKey, FaUnlockAlt, FaShieldAlt, 
  FaArrowLeft, FaPaperPlane 
} from 'react-icons/fa';

// Reuse the identical CSS from Register/Login for a consistent layout
import './Register.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim() || !email.includes('@')) {
            return Swal.fire('Error', 'Please enter a valid email address.', 'error');
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            
            // Beautiful Success Alert instead of standard browser alert
            Swal.fire({
                icon: 'success',
                title: 'OTP Sent Successfully!',
                text: 'Please check your email inbox (and spam folder) for the 6-digit reset code.',
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Enter OTP Now'
            }).then(() => {
                navigate('/reset-password', { state: { email } });
            });
            
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error sending reset code. Please try again.', 'error');
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <>
            <style>{`
                /* Custom Animations for Header Icons */
                @keyframes floatLogin { 
                    0% { transform: translateY(0px); } 
                    50% { transform: translateY(-8px); } 
                    100% { transform: translateY(0px); } 
                }
                .float-1 { animation: floatLogin 3s ease-in-out infinite; }
                .float-2 { animation: floatLogin 3s ease-in-out infinite 0.4s; }
                .float-3 { animation: floatLogin 3s ease-in-out infinite 0.8s; }

                /* Gradient Text for Title */
                .hero-gradient-text {
                    background: linear-gradient(to right, #1e3a8a, #ea580c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 2.2rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 8px;
                }
            `}</style>

            <div className="register-wrapper">
                
                {/* 🟦 LEFT DESKTOP PANEL (Recovery Guide) */}
                <div className="register-left">
                    <h1 className="panel-title">Secure Account Recovery</h1>
                    <p className="panel-subtitle">Don't worry! Follow these simple steps to get back into your SJ10 Seller Dashboard.</p>
                    
                    <div className="feature-item">
                        <div className="feature-icon"><FaEnvelope /></div>
                        <div className="feature-text">
                            <h3>1. Enter your Email</h3>
                            <p>Provide the exact email address associated with your seller account.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><FaKey /></div>
                        <div className="feature-text">
                            <h3>2. Receive an OTP</h3>
                            <p>We'll send a secure 6-digit verification code directly to your inbox.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><FaUnlockAlt /></div>
                        <div className="feature-text">
                            <h3>3. Reset & Login</h3>
                            <p>Create a strong new password and instantly access your store again.</p>
                        </div>
                    </div>
                </div>

                {/* ⬜ RIGHT FORM PANEL */}
                <div className="register-right">
                    <motion.div 
                        className="register-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        
                        {/* ─── ANIMATED HEADER SECTION ─── */}
                        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '15px' }}>
                                <FaShieldAlt size={34} color="#f97316" className="float-1" />
                                <FaUnlockAlt size={34} color="#2563eb" className="float-2" />
                                <FaKey size={34} color="#10b981" className="float-3" />
                            </div>
                            <h1 className="hero-gradient-text">Forgot Password?</h1>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', padding: '0 10px' }}>
                                Enter your registered email below to receive a secure password reset code.
                            </p>
                        </div>

                        {/* ─── RECOVERY FORM ─── */}
                        <form onSubmit={handleSubmit}>
                            
                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-icon-wrap">
                                    <FaEnvelope className="input-icon" />
                                    <input 
                                        className="reg-input" 
                                        type="email" 
                                        placeholder="e.g. yourname@company.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '15px' }}>
                                {loading ? (
                                    'Sending Secure Code...'
                                ) : (
                                    <>
                                        <FaPaperPlane /> Send Reset OTP
                                    </>
                                )}
                            </button>

                        </form>

                        {/* ─── FOOTER LINK ─── */}
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Link to="/login" style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                color: 'var(--text-muted)', fontSize: '15px', textDecoration: 'none',
                                fontWeight: 500, transition: 'color 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <FaArrowLeft /> Wait, I remember it! Back to Login
                            </Link>
                        </div>

                    </motion.div>
                </div>
            </div>
        </>
    );
}