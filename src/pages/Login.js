// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import './FormStyles.css'; // Using the beautifully updated styles

// A simple component for the particle background effect
const ParticleBackground = () => (
    <div className="particle-container">
        {[...Array(10)].map((_, i) => <span key={i} className="particle"></span>)}
    </div>
);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const Login = () => {
    // We renamed 'email' to 'identifier' to be clear it accepts Email/Phone/Code
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // New state to control the color of the error message box
    const [errorType, setErrorType] = useState('error'); // 'error' (red) or 'warning' (yellow)

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorType('error'); // Reset to default red

        if (!identifier || !password) { 
            setError('Please enter your Login ID and password.'); 
            return; 
        }

        setIsLoading(true);
        try {
            // We send 'identifier' which matches the updated backend logic
            await authService.login({ identifier, password });
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            
            // Check for specific keywords to style the message differently
            if (msg.includes('under review') || msg.includes('patient')) {
                setErrorType('warning'); // Yellow for Pending
            } else {
                setErrorType('error'); // Red for Banned/Rejected/Wrong Password
            }
            
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    return (
        <div className="auth-layout">
            <ParticleBackground />
            <div className="branding-panel">
                <motion.img src="/logo.gif" alt="SJ10 Logo" className="branding-logo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, delay: 0.2 }} />
                <motion.h1 className="branding-title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>Supplier Panel</motion.h1>
                <motion.p className="branding-subtitle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>Manage your products, orders, and growth all in one place.</motion.p>
            </div>

            <div className="form-panel">
                <motion.div className="glass-form-container" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}>
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div className="form-header" variants={itemVariants}>
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue</p>
                        </motion.div>

                        <motion.form onSubmit={handleSubmit} className="auth-form" variants={itemVariants}>
                            <div className="input-group">
                                <label htmlFor="identifier">Login ID</label>
                                <input 
                                    id="identifier" 
                                    type="text" 
                                    placeholder="Email, Phone, or Supplier Code" 
                                    value={identifier} 
                                    onChange={(e) => setIdentifier(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrapper">
                                    <input 
                                        id="password" 
                                        type={isPasswordVisible ? 'text' : 'password'} 
                                        placeholder="••••••••" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    <motion.span 
                                        onClick={togglePasswordVisibility} 
                                        className="password-toggle-icon"
                                        whileTap={{ scale: 0.8, rotate: 20 }}
                                    >
                                        {isPasswordVisible ? '🙈' : '👁️'}
                                    </motion.span>
                                </div>
                            </div>
                            <div className="form-options"><Link to="/forgot-password">Forgot Password?</Link></div>
                        </motion.form>

                        {error && (
                            <motion.div 
                                className={`error-message ${errorType}`} // Add class based on type
                                variants={itemVariants}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Add an icon based on the error type */}
                                <span style={{ marginRight: '8px', fontSize: '1.2em' }}>
                                    {errorType === 'warning' ? '⏳' : '⚠️'}
                                </span>
                                {error}
                            </motion.div>
                        )}

                        <motion.button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={isLoading} 
                            onClick={handleSubmit} 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoading ? <div className="spinner"></div> : 'Sign In'}
                        </motion.button>
                        
                        <motion.div className="redirect-link" variants={itemVariants}>
                            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;