// src/pages/ResetPassword.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Beautiful Icons
import { 
    FaLock, FaKey, FaShieldAlt, FaEye, FaEyeSlash, 
    FaCheckCircle, FaEnvelopeOpenText 
} from 'react-icons/fa';

// Reuse the identical CSS from Register/Login for a consistent beautiful layout
import './Register.css';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // States
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const email = location.state?.email;
    const otpRefs = useRef(Array(6).fill(null).map(() => React.createRef()));

    // Redirect back to forgot-password if accessed directly without email
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // --- OTP HANDLERS (Smooth Auto-focus & Backspace) ---
    const handleOTPChange = (idx, val) => {
        if (!/^\d?$/.test(val)) return; // Only allow digits
        const next = [...otpValues]; 
        next[idx] = val; 
        setOtpValues(next);
        
        // Auto-focus next input
        if (val && idx < 5) otpRefs.current[idx + 1].current?.focus();
    };

    const handleOTPKey = (idx, e) => {
        // Backspace to previous input
        if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
            otpRefs.current[idx - 1].current?.focus();
        }
    };

    const handleOTPPaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const next = Array(6).fill('');
        [...text].forEach((ch, i) => { next[i] = ch; });
        setOtpValues(next);
        const lastIdx = Math.min(text.length, 5);
        if(otpRefs.current[lastIdx].current) otpRefs.current[lastIdx].current.focus();
    };

    // --- SUBMIT HANDLER ---
    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        const code = otpValues.join('');
        
        if (code.length !== 6) {
            return Swal.fire('Warning', 'Please enter all 6 digits of the OTP.', 'warning');
        }
        if (newPassword.length < 6) {
            return Swal.fire('Warning', 'Password must be at least 6 characters long.', 'warning');
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, code, newPassword);
            
            Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been successfully reset. Please login with your new password.',
                confirmButtonColor: '#2563eb',
                timer: 2500
            }).then(() => {
                navigate('/login');
            });

        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || "Invalid OTP or request expired.", 'error');
            // Clear OTP fields on error for easy re-entry
            setOtpValues(Array(6).fill(''));
            otpRefs.current[0].current?.focus();
        } finally { 
            setLoading(false); 
        }
    };

    if (!email) return null; // Prevent rendering while redirecting

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

                /* Gradient Text */
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
                
                {/* 🟦 LEFT DESKTOP PANEL (Security Guide) */}
                <div className="register-left">
                    <h1 className="panel-title">Secure Your Shop</h1>
                    <p className="panel-subtitle">You're almost there! Let's get your account securely recovered.</p>
                    
                    <div className="feature-item">
                        <div className="feature-icon"><FaEnvelopeOpenText /></div>
                        <div className="feature-text">
                            <h3>1. Verify Identity</h3>
                            <p>Enter the 6-digit OTP code we just sent to your email inbox.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><FaKey /></div>
                        <div className="feature-text">
                            <h3>2. Strong Password</h3>
                            <p>Create a password with at least 6 characters. Use letters and numbers.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><FaCheckCircle /></div>
                        <div className="feature-text">
                            <h3>3. Safe & Secure</h3>
                            <p>Your shop's data is encrypted. We take your security seriously.</p>
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
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '15px' }}>
                                <FaShieldAlt size={34} color="#10b981" className="float-1" />
                                <FaLock size={34} color="#2563eb" className="float-2" />
                                <FaKey size={34} color="#f97316" className="float-3" />
                            </div>
                            <h1 className="hero-gradient-text">New Password</h1>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                Enter the verification code sent to <br/>
                                <strong style={{color: '#111827'}}>{email}</strong>
                            </p>
                        </div>

                        {/* ─── OTP & PASSWORD FORM ─── */}
                        <form onSubmit={handleVerifyAndReset}>
                            
                            {/* Beautiful OTP Input Wrapper */}
                            <div className="otp-container" style={{ margin: '30px 0' }}>
                                <div className="otp-fields" onPaste={handleOTPPaste}>
                                    {otpValues.map((val, idx) => (
                                        <input
                                            key={idx}
                                            ref={otpRefs.current[idx]}
                                            className={`otp-digit ${val ? 'filled' : ''}`}
                                            maxLength={1}
                                            inputMode="numeric"
                                            value={val}
                                            onChange={(e) => handleOTPChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOTPKey(idx, e)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* New Password Input */}
                            <div className="input-group">
                                <label>Create New Password</label>
                                <div className="input-icon-wrap pw-wrap">
                                    <FaLock className="input-icon" />
                                    <input 
                                        className="reg-input" 
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimum 6 characters" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                    />
                                    <span className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '15px' }}>
                                {loading ? 'Updating Password...' : 'Reset & Login'}
                            </button>

                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}