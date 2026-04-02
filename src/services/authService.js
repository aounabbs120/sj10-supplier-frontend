// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Agar backend direct /auth use kar raha hai to hum base path yahi rakhenge
const AUTH_URL = `${API_BASE_URL}/auth`;

const register = async (userData) => {
    const response = await axios.post(`${AUTH_URL}/register`, userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${AUTH_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// Naya OTP based verification
const verifyEmail = async (email, otp) => {
    const response = await axios.post(`${AUTH_URL}/verify-email`, { email, otp });
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await axios.post(`${AUTH_URL}/forgot-password`, { email });
    return response.data;
};

// Naya OTP based Reset
const resetPassword = async (email, otp, newPassword) => {
    const response = await axios.post(`${AUTH_URL}/reset-password`, { email, otp, newPassword });
    return response.data;
};

const googleLogin = async (accessToken) => {
    const response = await axios.post(`${AUTH_URL}/google`, { accessToken });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

const completeProfile = async (profileData) => {
    const token = localStorage.getItem('supplierToken');
    const response = await axios.post(`${AUTH_URL}/complete-profile`, profileData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('supplierToken');
    localStorage.removeItem('tempAuthToken');
};

const authService = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    googleLogin,
    completeProfile,
    logout
};

export default authService;