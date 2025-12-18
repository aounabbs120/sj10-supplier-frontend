import axios from 'axios';

// Ensure this matches your backend port (usually 4000)
const API_URL = 'http://localhost:4000/auth';

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('supplierToken', response.data.token);
    }
    return response.data;
};

// New Function
const verifyEmail = async (token) => {
    const response = await axios.post(`${API_URL}/verify-email`, { token });
    return response.data;
};

// New Function
const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
};

// New Function
const resetPassword = async (token, newPassword) => {
    const response = await axios.put(`${API_URL}/reset-password/${token}`, { password: newPassword });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('supplierToken');
};

export default {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout
};