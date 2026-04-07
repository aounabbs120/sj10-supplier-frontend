// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4007';

// 🟢 FIX: Added '/api/auth' to all routes
const register = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

const verifyEmail = async (email, otp) => {
    // Backend ko dono cheezein chahiye: email aur otp
    const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, { email, otp });
    return response.data;
};


const forgotPassword = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
    return response.data;
};

const resetPassword = async (email, otp, newPassword) => {
    // 🟢 Body-based request bhejni hai, URL param nahi
    const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
    });
    return response.data;
};
const logout = () => {
    localStorage.removeItem('supplierToken');
};

const googleLogin = async (accessToken) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { accessToken });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

const facebookLogin = async (accessToken, userID) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/facebook`, { accessToken, userID });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

const completeProfile = async (profileData) => {
    const token = localStorage.getItem('supplierToken');
    const response = await axios.post(`${API_BASE_URL}/api/auth/complete-profile`, profileData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

const authService = {
    register, login, verifyEmail, forgotPassword, resetPassword, googleLogin, facebookLogin, completeProfile, logout
};

export default authService;