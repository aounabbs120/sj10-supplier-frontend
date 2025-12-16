import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './FormStyles.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authService.login({ email, password });
            console.log(data.message);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="form-container">
            <div className="form-image-placeholder">
                <img src="/login.gif" alt="Login Animation" className="form-image" />
            </div>

            <h2>Welcome Back</h2>
            <p>Please sign in to access your supplier panel.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="password-wrapper">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                        {isPasswordVisible ? '🙈' : '👁️'}
                    </span>
                </div>
{/* Add this link inside the form */}
<div style={{ textAlign: 'right', marginBottom: '10px' }}>
    <Link to="/forgot-password" style={{ color: '#007bff', fontSize: '14px' }}>Forgot Password?</Link>
</div>
                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : 'Sign In'}
                </button>
            </form>

            <p className="redirect-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;