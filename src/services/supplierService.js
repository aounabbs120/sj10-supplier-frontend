// src/services/supplierService.js
import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Add Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('supplierToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401/403 Errors (Logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const supplierApi = (endpoint) => `/supplier${endpoint}`;

// --- DASHBOARD & PROFILE ---
const getDashboardStats = async () => (await api.get(supplierApi('/dashboard-stats'))).data;
const getMyProfile = async () => (await api.get(supplierApi('/profile'))).data;
const updateMyProfile = async (profileData) => (await api.put(supplierApi('/profile'), profileData)).data;

// --- PRODUCTS ---
const getMyProducts = async () => (await api.get(supplierApi('/products'))).data;
const getProductById = async (productId) => (await api.get(supplierApi(`/products/${productId}`))).data;
const createProduct = async (productData) => (await api.post(supplierApi('/products'), productData)).data;
const updateProduct = async (productId, productData) => (await api.put(supplierApi(`/products/${productId}`), productData)).data;
const deleteProduct = async (productId) => (await api.delete(supplierApi(`/products/${productId}`))).data;
const getCategories = async () => (await api.get(supplierApi('/categories'))).data;
const addVariantsInBatch = async (productId, variantsArray) => (await api.post(supplierApi(`/products/${productId}/variants/batch`), { variants: variantsArray })).data;
const uploadFiles = async (formData) => (await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data;

// --- ORDERS (MISSING FUNCTIONS ADDED HERE) ---
const getMyOrders = async () => (await api.get('/orders')).data;

// ✅ THIS WAS MISSING - ADD IT NOW
const getMyOrderDetails = async (orderId) => (await api.get(`/orders/${orderId}`)).data; 

const addTrackingToShipment = async (shipmentId, trackingData) => (await api.put(`/orders/shipments/${shipmentId}/track`, trackingData)).data;

// --- MARKETING & VERIFICATION ---
const getMyReviews = async () => (await api.get('/reviews')).data;
const getMyPromotions = async () => (await api.get('/promotions')).data;
const getPromotionPricing = async () => (await api.get('/promotions/pricing')).data;
const requestPromotion = async (promotionData) => (await api.post('/promotions/request', promotionData)).data;
const getPromotionById = async (promotionId) => (await api.get(`/promotions/${promotionId}`)).data;
const submitVerificationDocuments = async (docUrls) => (await axios.post(`${API_BASE_URL}/api/verification/submit`, docUrls, { headers: { 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data;

// --- NOTIFICATIONS ---
const getVapidPublicKey = async () => {
    const response = await api.get(supplierApi('/vapid-public-key'));
    return response.data;
};
const saveSubscription = async (subscription) => {
    return await api.post(supplierApi('/subscribe'), { subscription });
};

const supplierService = {
    getDashboardStats, getMyProfile, updateMyProfile,
    getMyProducts, getProductById, createProduct, updateProduct, deleteProduct,
    getCategories, addVariantsInBatch, uploadFiles,
    getMyOrders, getMyOrderDetails, addTrackingToShipment, // <--- Ensure getMyOrderDetails is exported
    getMyReviews, getMyPromotions, getPromotionPricing, requestPromotion, getPromotionById,
    submitVerificationDocuments, getVapidPublicKey, saveSubscription
};

export default supplierService;