import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './FormStyles.css';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', email: '', contactNumber: '', password: '',
        brandName: '', city: '', address: '',
        business_type: 'Retailer', stock_quantity_range: '1-100',
        gender: 'Male', age: '',
        // We no longer handle profile_pic here
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const totalSteps = 3;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (input) => (e) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    // --- FIX: This now handles the correct, secure registration flow ---
   const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // 1. Send data to backend
            const response = await authService.register(formData);
            
            // 2. Show alert and move to login
            alert(response.message); // "Registration successful! Check your email..."
            navigate('/login'); 

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3>Step 1: Basic Information</h3>
                        <input type="text" placeholder="Full Name" onChange={handleChange('fullName')} value={formData.fullName} required />
                        <input type="email" placeholder="Email" onChange={handleChange('email')} value={formData.email} required />
                        <input type="text" placeholder="Contact Number" onChange={handleChange('contactNumber')} value={formData.contactNumber} required />
                        <input type="password" placeholder="Password" onChange={handleChange('password')} value={formData.password} required />
                        <button type="button" onClick={nextStep} className="next-btn">Next</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Step 2: Shop & Business Details</h3>
                        <input type="text" placeholder="Brand Name" onChange={handleChange('brandName')} value={formData.brandName} required />
                        <input type="text" placeholder="City" onChange={handleChange('city')} value={formData.city} required />
                        <input type="text" placeholder="Address" onChange={handleChange('address')} value={formData.address} required />
                        <select onChange={handleChange('business_type')} value={formData.business_type}>
                            <option value="Retailer">Retailer</option>
                            <option value="Wholesaler">Wholesaler</option>
                        </select>
                         <select onChange={handleChange('stock_quantity_range')} value={formData.stock_quantity_range}>
                            <option value="1-100">1-100</option>
                            <option value="100-1000">100-1000</option>
                            <option value="10000+">10,000+</option>
                        </select>
                        <div className="button-group">
                            <button type="button" onClick={prevStep} className="back-btn">Back</button>
                            <button type="button" onClick={nextStep} className="next-btn">Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Step 3: Profile Details</h3>
                        <select onChange={handleChange('gender')} value={formData.gender}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <input type="number" placeholder="Age" onChange={handleChange('age')} value={formData.age} />
                        
                        {/* We no longer need the file input on this page */}
                        <p className="form-hint" style={{marginTop: '20px'}}>You can upload a profile picture on the next page.</p>

                        {error && <p className="error-message">{error}</p>}
                        <div className="button-group">
                            <button type="button" onClick={prevStep} className="back-btn">Back</button>
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? <div className="spinner"></div> : 'Complete Sign Up'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Form completed.</div>;
        }
    };

    return (
        <div className="form-container">
            <div className="form-image-placeholder">
                <img src="/signup.gif" alt="Signup Animation" className="form-image" />
            </div>

            <div className="progress-bar">
                <div 
                    className="progress-bar-inner" 
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
            </div>

            <h2>Create Your Account</h2>
            
            <form onSubmit={handleSubmit}>
                {renderStep()}
            </form>

            <p className="redirect-link">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
};

export default Register;