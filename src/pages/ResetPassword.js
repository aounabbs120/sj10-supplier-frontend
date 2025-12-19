// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';
import './ResetPassword.css'; // Make sure to import the CSS we created above

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        exit: { opacity: 0, scale: 0.9 }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token, password);
            setMessage("Password reset successful! Redirecting...");
            
            // Wait 2.5 seconds so user can see the success animation
            setTimeout(() => {
                navigate('/login');
            }, 2500);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reset password. Link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    // If no token, show invalid link state
    if (!token) {
        return (
            <div className="reset-container">
                <motion.div 
                    className="reset-glass-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="icon-wrapper" style={{background: 'rgba(239, 68, 68, 0.2)'}}>
                        <span className="lock-icon">⚠️</span>
                    </div>
                    <h2 className="reset-title">Invalid Link</h2>
                    <p className="reset-subtitle">This password reset link is invalid or has expired.</p>
                    <Link to="/login" className="reset-btn" style={{display: 'inline-block', textDecoration:'none', width:'auto', padding:'10px 30px'}}>
                        Return to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="reset-container">
            <motion.div 
                className="reset-glass-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Animated Lock Icon */}
                <motion.div 
                    className="icon-wrapper"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <span className="lock-icon">🔐</span>
                </motion.div>

                <h2 className="reset-title">Reset Password</h2>
                <p className="reset-subtitle">Create a strong, new password for your account.</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* New Password Field */}
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="input-field"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide Password" : "Show Password"}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="input-group">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="input-field"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            title={showConfirmPassword ? "Hide Password" : "Show Password"}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    {/* Animations for Errors/Success */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="status-msg error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <span>⚠️</span> {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div 
                                className="status-msg success"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <span>✅</span> {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button 
                        type="submit" 
                        className="reset-btn"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? <div className="spinner-small"></div> : 'Update Password'}
                    </motion.button>
                </form>

                <Link to="/login" className="back-link">
                    ← Back to Login
                </Link>

            </motion.div>
        </div>
    );
};

export default ResetPassword;