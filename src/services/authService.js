// src/services/authService.js

import axios from 'axios';

// --- FIX #1: REMOVED the hardcoded localhost URL ---
// const API_URL = 'http://localhost:4000/auth'; 
// Instead, we use the environment variable. This is critical for deployment.
// It will use the value you set in Netlify's build settings.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const register = async (userData) => {
    // Use the environment variable for the URL
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

const verifyEmail = async (token) => {
    // Note: Your original file had a POST request here. If your VerifyEmail.js uses GET,
    // you might need to align them. But for this fix, we keep your original service logic.
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, { token });
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
};

const resetPassword = async (token, newPassword) => {
    const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('supplierToken');
};


// --- FIX #2: RESOLVED the Anonymous Export ESLint Error ---
// Instead of exporting an anonymous object, we assign it to a named constant...
const authService = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout
};

// ...and then export the named constant as the default.
export default authService;