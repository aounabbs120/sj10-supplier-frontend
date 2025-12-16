// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
// We use the same CSS as Login/Register to keep it looking good
import './FormStyles.css'; 

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get the token from the URL (e.g. ?token=12345)
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Invalid or missing reset token. Please try the link from your email again.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        try {
            // Call the service function we created earlier
            await authService.resetPassword(token, password);
            
            setMessage("Success! Your password has been reset.");
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reset password. Link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="form-container" style={{textAlign: 'center', marginTop: '50px'}}>
                <h2 style={{color: 'white'}}>Invalid Link</h2>
                <p style={{color: '#ccc'}}>The password reset link is invalid or missing.</p>
                <Link to="/login" className="back-btn">Return to Login</Link>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-image-placeholder">
                <img src="/login.gif" alt="Reset Password" className="form-image" />
            </div>

            <h2>Set New Password</h2>
            <p>Please enter your new password below.</p>

            <form onSubmit={handleSubmit}>
                {/* New Password Input */}
                <div className="password-wrapper">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="password-toggle-icon">
                        {isPasswordVisible ? '🙈' : '👁️'}
                    </span>
                </div>

                {/* Confirm Password Input */}
                <div className="password-wrapper" style={{marginTop: '15px'}}>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message" style={{color: '#4ade80', marginTop: '10px'}}>{message}</p>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;