// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://sj1osupplierbackend1.vercel.app';

// 1. Register Supplier (Manual Signup)
const register = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 2. Login
const login = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// 3. 🟢 VERIFY MANUAL SIGNUP (Supports Dual Email + WhatsApp OTP)
const verifyEmail = async (email, emailOtp, whatsappOtp = null) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, { 
        email, 
        emailOtp, 
        whatsappOtp,
        otp: emailOtp // fallback for legacy
    });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// 4. Google Login
const googleLogin = async (accessToken) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { accessToken });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// 5. Complete Profile (For Google users)
const completeProfile = async (profileData) => {
    const token = localStorage.getItem('tempAuthToken');
    const response = await axios.post(`${API_BASE_URL}/api/auth/complete-profile`, profileData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

// 6. 🟢 VERIFY GOOGLE PHONE WHATSAPP OTP
const verifyPhoneOtp = async (otp) => {
    const token = localStorage.getItem('tempAuthToken');
    const response = await axios.post(`${API_BASE_URL}/api/auth/verify-phone-otp`, { otp }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// 7. Password Recovery
const forgotPassword = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
    return response.data;
};

const resetPassword = async (email, otp, newPassword) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
    });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('supplierToken');
    localStorage.removeItem('tempAuthToken');
};

const authService = {
    register, login, verifyEmail, forgotPassword, resetPassword, 
    googleLogin, completeProfile, verifyPhoneOtp, logout
};

export default authService;