// src/services/supplierService.js

import axios from 'axios';
import authService from './authService';

// --- THIS IS THE CRITICAL FIX ---
// REMOVED: const API_URL = 'http://localhost:4000/api';
// ADDED: Using the environment variable for deployment.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

// Create a single, centralized Axios instance.
const api = axios.create({
    // Use the base URL which will be either the live URL or localhost
    baseURL: `${API_BASE_URL}/api`, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to every request (this is correct).
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('supplierToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle auth errors (this is correct).
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log("Authentication error detected. Logging out.");
            authService.logout();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Most functions use the /supplier path prefix
const supplierApi = (endpoint) => `/supplier${endpoint}`;

// --- All other functions remain the same, they will now correctly use the live URL ---
const getDashboardStats = async () => (await api.get(supplierApi('/dashboard-stats'))).data;
const getMyProducts = async () => (await api.get(supplierApi('/products'))).data;
const getProductById = async (productId) => (await api.get(supplierApi(`/products/${productId}`))).data;
const createProduct = async (productData) => (await api.post(supplierApi('/products'), productData)).data;
const updateProduct = async (productId, productData) => (await api.put(supplierApi(`/products/${productId}`), productData)).data;
const deleteProduct = async (productId) => (await api.delete(supplierApi(`/products/${productId}`))).data;
const addVariantToProduct = async (productId, variantData) => (await api.post(supplierApi(`/products/${productId}/variants`), variantData)).data;
const addVariantsInBatch = async (productId, variantsArray) => (await api.post(supplierApi(`/products/${productId}/variants/batch`), { variants: variantsArray })).data;
const getCategories = async () => (await api.get(supplierApi('/categories'))).data;
const getMyProfile = async () => (await api.get(supplierApi('/profile'))).data;
const updateMyProfile = async (profileData) => (await api.put(supplierApi('/profile'), profileData)).data;
const getMyReviews = async () => (await api.get(supplierApi('/reviews'))).data;
const getMyOrders = async () => (await api.get(supplierApi('/orders'))).data;
const addTrackingToShipment = async (shipmentId, trackingData) => (await api.put(supplierApi(`/shipments/${shipmentId}/track`), trackingData)).data;
const getMyPromotions = async () => (await api.get(supplierApi('/promotions'))).data;
const getPromotionPricing = async () => (await api.get(supplierApi('/promotions/pricing'))).data;
const requestPromotion = async (promotionData) => (await api.post(supplierApi('/promotions/request'), promotionData)).data;
const getPromotionById = async (promotionId) => (await api.get(supplierApi(`/promotions/${promotionId}`))).data;

const submitVerificationDocuments = async (docUrls) => {
    // This correctly calls a different root endpoint
    return (await axios.post(`${API_BASE_URL}/api/verification/submit`, docUrls, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }
    })).data;
};

const uploadFiles = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('supplierToken')}`,
        },
    });
    return response.data;
};

const importProductsCSV = async (products) => (await api.post(supplierApi('/products/import'), { products })).data;
const getProductCartStats = async () => (await api.get(supplierApi('/products/cart-stats'))).data;

const supplierService = {
    getDashboardStats, getMyProducts, getProductById, createProduct, updateProduct, deleteProduct,
    addVariantToProduct, addVariantsInBatch, getCategories, getMyProfile, updateMyProfile, uploadFiles,
    importProductsCSV, getProductCartStats, getMyReviews, getMyOrders, addTrackingToShipment,
    getMyPromotions, getPromotionPricing, requestPromotion, getPromotionById, submitVerificationDocuments,
};

export default supplierService;