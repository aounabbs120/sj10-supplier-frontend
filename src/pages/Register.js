// src/pages/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';
import './FormStyles.css'; 

// A more visually appealing step indicator with icons
const StepIndicator = ({ currentStep, totalSteps }) => {
    const steps = [
        { label: "Account", icon: "👤" },
        { label: "Business", icon: "🏢" },
        { label: "Profile", icon: "📝" },
    ];
    return (
        <div className="step-indicator">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className={`step ${i + 1 <= currentStep ? 'active' : ''}`}>
                        <div className="step-icon-wrapper">
                            <div className="step-icon">{step.icon}</div>
                        </div>
                        <div className="step-label">{step.label}</div>
                    </div>
                    {i < totalSteps - 1 && <div className={`step-line ${i + 1 < currentStep ? 'completed' : ''}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

// The beautiful, animated success screen
const SuccessScreen = () => (
    <motion.div 
        className="success-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
    >
        <div className="success-icon">✓</div>
        <h2>Account Created!</h2>
        <p>Dear Seller, thank you for signing up. Please check your email to verify your account before logging in.</p>
    </motion.div>
);

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', email: '', contactNumber: '', password: '',
        brandName: '', city: '', address: '',
        business_type: 'Retailer', stock_quantity_range: '1-100',
        gender: 'Male', age: '',
    });
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [direction, setDirection] = useState(1);
    const navigate = useNavigate();
    const totalSteps = 3;

    const handleChange = (input) => (e) => {
        setFormData({ ...formData, [input]: e.target.value });
        // Clear error when user starts typing again
        if (error) setError('');
    };
    
    const handleBoxSelect = (field, value) => setFormData({ ...formData, [field]: value });

    // --- Per-step validation logic ---
    const validateStep = () => {
        setError(''); 
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.password) {
                setError("Please fill in all required fields for this step."); return false;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setError("Please enter a valid email address."); return false;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters long."); return false;
            }
        }
        if (step === 2) {
            if (!formData.brandName || !formData.city || !formData.address) {
                setError("Please fill in all required business details."); return false;
            }
        }
        return true;
    };

    const nextStep = () => { if (validateStep()) { setDirection(1); setStep(s => s + 1); }};
    const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        setError('');
        setIsLoading(true);

        try {
            await authService.register(formData);
            setIsSubmitted(true);
            setTimeout(() => navigate('/login'), 5000); // Give them time to read the success message
        } catch (err) {
            // --- HERE IS THE FIX: Display the specific backend message ---
            // The backend sends: "This Email Address is already registered..." or "This Phone Number..."
            const backendMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(backendMsg);
            
            // If the error is about Email or Phone (Step 1), move the user back to Step 1 automatically
            if (backendMsg.toLowerCase().includes('email') || backendMsg.toLowerCase().includes('phone') || backendMsg.toLowerCase().includes('number')) {
                setStep(1);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const variants = {
        enter: (direction) => ({ x: direction * 50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction * -50, opacity: 0 }),
    };

    return (
        <div className="auth-layout">
            <div className="branding-panel">
                <motion.img src="/logo.gif" alt="SJ10 Logo" className="branding-logo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }} />
                <motion.h1 className="branding-title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>Empower Your Business</motion.h1>
                <motion.p className="branding-subtitle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>Join Pakistan's fastest-growing marketplace and reach thousands of new customers.</motion.p>
            </div>

            <div className="form-panel">
                <motion.div className="glass-form-container register" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                    {isSubmitted ? <SuccessScreen /> : (
                        <>
                            <StepIndicator currentStep={step} totalSteps={totalSteps} />
                            <div className="form-wrapper">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.form key={step} onSubmit={handleSubmit} className="auth-form" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: 'tween', ease: 'circOut', duration: 0.5 }}>
                                        {step === 1 && (
                                            <>
                                                <div className="input-group"><label>Full Name</label><input type="text" placeholder="e.g., Aoun Abbas" onChange={handleChange('fullName')} value={formData.fullName} /></div>
                                                <div className="input-group"><label>Email</label><input type="email" placeholder="you@example.com" onChange={handleChange('email')} value={formData.email} /></div>
                                                <div className="input-group"><label>Contact Number</label><input type="tel" placeholder="03001234567" onChange={handleChange('contactNumber')} value={formData.contactNumber} /></div>
                                                <div className="input-group"><label>Password</label><input type="password" placeholder="Minimum 6 characters" onChange={handleChange('password')} value={formData.password} /></div>
                                            </>
                                        )}
                                        {step === 2 && (
                                            <>
                                                <div className="input-group"><label>Brand Name</label><input type="text" placeholder="e.g., SJ10 Fashions" onChange={handleChange('brandName')} value={formData.brandName} /></div>
                                                <div className="input-group"><label>City</label><input type="text" placeholder="e.g., Lahore" onChange={handleChange('city')} value={formData.city} /></div>
                                                <div className="input-group"><label>Full Address</label><input type="text" placeholder="Your shop or warehouse address" onChange={handleChange('address')} value={formData.address} /></div>
                                                <div className="input-group"><label>Business Type</label><div className="radio-box-group"><div className={`radio-box ${formData.business_type === 'Retailer' ? 'selected' : ''}`} onClick={() => handleBoxSelect('business_type', 'Retailer')}>Retailer</div><div className={`radio-box ${formData.business_type === 'Wholesaler' ? 'selected' : ''}`} onClick={() => handleBoxSelect('business_type', 'Wholesaler')}>Wholesaler</div></div></div>
                                            </>
                                        )}
                                        {step === 3 && (
                                            <>
                                                <div className="input-group"><label>Gender</label><div className="radio-box-group"><div className={`radio-box ${formData.gender === 'Male' ? 'selected' : ''}`} onClick={() => handleBoxSelect('gender', 'Male')}>Male</div><div className={`radio-box ${formData.gender === 'Female' ? 'selected' : ''}`} onClick={() => handleBoxSelect('gender', 'Female')}>Female</div><div className={`radio-box ${formData.gender === 'Other' ? 'selected' : ''}`} onClick={() => handleBoxSelect('gender', 'Other')}>Other</div></div></div>
                                                <div className="input-group"><label>Age</label><input type="number" placeholder="e.g., 25" onChange={handleChange('age')} value={formData.age} /></div>
                                                <div className="input-group custom-select"><label>Average Stock Quantity</label><select onChange={handleChange('stock_quantity_range')} value={formData.stock_quantity_range}><option value="1-100">1-100 Items</option><option value="100-1000">100-1000 Items</option><option value="10000+">10,000+ Items</option></select></div>
                                                <p className="form-hint">You can upload a profile picture and verify your account after approval.</p>
                                            </>
                                        )}
                                    </motion.form>
                                </AnimatePresence>
                            </div>
                            
                            {/* --- NEW: Animated Error Box using FormStyles.css classes --- */}
                            {error && (
                                <motion.div 
                                    className="error-message error" 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span style={{ marginRight: '8px', fontSize: '1.2em' }}>⚠️</span>
                                    {error}
                                </motion.div>
                            )}

                            <div className="multi-step-actions">
                                {step > 1 && <motion.button type="button" className="back-btn" onClick={prevStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Back</motion.button>}
                                {step < totalSteps && <motion.button type="button" className="next-btn" onClick={nextStep}>Next →</motion.button>}
                                {step === totalSteps && <motion.button type="button" className="submit-btn" disabled={isLoading} onClick={handleSubmit}>{isLoading ? <div className="spinner"></div> : 'Complete Sign Up'}</motion.button>}
                            </div>

                            <div className="redirect-link">
                                <p>Already have an account? <Link to="/login">Sign In</Link></p>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Register;