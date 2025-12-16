// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import './FormStyles.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // States: 'idle', 'success', 'error'
    const [status, setStatus] = useState('idle'); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus('error');
            setErrorMessage('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            // Attempt to send the reset link
            await authService.forgotPassword(email);
            
            // If successful (Backend returns 200 OK)
            setStatus('success');
            
        } catch (error) {
            console.error("Forgot Password Error:", error);
            // If failed (Backend returns 400 or 500)
            setStatus('error');
            setErrorMessage(error.response?.data?.message || "Email didn't send. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER: SUCCESS STATE ---
    if (status === 'success') {
        return (
            <div className="form-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
                <h2 style={{ color: '#fff', marginBottom: '10px' }}>Check Your Inbox</h2>
                <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                    We have sent a password reset link to: <br/>
                    <strong style={{ color: '#4f46e5' }}>{email}</strong>
                </p>
                <p style={{ color: '#888', fontSize: '0.9em', marginTop: '10px' }}>
                    Didn't receive it? Check your spam folder.
                </p>

                <Link to="/login" className="submit-btn" style={{ 
                    marginTop: '30px', 
                    display: 'inline-block', 
                    textDecoration: 'none', 
                    lineHeight: '45px' // Vertically center text in button
                }}>
                    Back to Login
                </Link>
            </div>
        );
    }

    // --- RENDER: FORM STATE ---
    return (
        <div className="form-container">
            {/* SVG Lock Icon for visuals */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>

            <h2 style={{ textAlign: 'center' }}>Forgot Password?</h2>
            <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '30px', fontSize: '0.95rem' }}>
                Enter your registered email and we'll send you a link to get back into your account.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ paddingLeft: '15px' }} // Simple adjustment
                    />
                </div>

                {status === 'error' && (
                    <div className="error-message" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span> {errorMessage}
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : 'Send Reset Link'}
                </button>
            </form>

            {/* Back Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" style={{ 
                    color: '#ccc', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '5px',
                    fontSize: '0.9rem',
                    transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
                >
                    <span>←</span> Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;