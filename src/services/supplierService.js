// src/services/supplierService.js

import axios from 'axios';
import authService from './authService';

// The base URL for your protected supplier APIs
// NOTE: We change the API_URL here for the verification endpoint.
const API_URL = 'http://localhost:4000/api';

// Create a single, centralized Axios instance.
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to every request.
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

// Interceptor to handle auth errors and auto-logout.
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

// --- All Service Functions ---

// Most functions use the /supplier path prefix
const supplierApi = (endpoint) => `/supplier${endpoint}`;

const getDashboardStats = async () => (await api.get(supplierApi('/dashboard-stats'))).data;
const getMyProducts = async () => (await api.get(supplierApi('/products'))).data;
const getProductById = async (productId) => (await api.get(supplierApi(`/products/${productId}`))).data;
const createProduct = async (productData) => (await api.post(supplierApi('/products'), productData)).data;
const updateProduct = async (productId, productData) => (await api.put(supplierApi(`/products/${productId}`), productData)).data;
const deleteProduct = async (productId) => (await api.delete(supplierApi(`/products/${productId}`))).data;
const addVariantToProduct = async (productId, variantData) => (await api.post(supplierApi(`/products/${productId}/variants`), variantData)).data;
// 👇 --- THIS IS THE CORRECTED FUNCTION --- 👇
const addVariantsInBatch = async (productId, variantsArray) => {
    // We now correctly use the helper to construct the full URL: /api/supplier/products/...
    return (await api.post(supplierApi(`/products/${productId}/variants/batch`), { variants: variantsArray })).data;
};
const getCategories = async () => (await api.get(supplierApi('/categories'))).data;
const getMyProfile = async () => (await api.get(supplierApi('/profile'))).data;
const updateMyProfile = async (profileData) => (await api.put(supplierApi('/profile'), profileData)).data;
const getMyReviews = async () => (await api.get(supplierApi('/reviews'))).data;
const getMyOrders = async () => (await api.get(supplierApi('/orders'))).data;
const addTrackingToShipment = async (shipmentId, trackingData) => {
    return (await api.put(supplierApi(`/shipments/${shipmentId}/track`), trackingData)).data;
};

// --- Promotion Functions ---
const getMyPromotions = async () => (await api.get(supplierApi('/promotions'))).data;
const getPromotionPricing = async () => (await api.get(supplierApi('/promotions/pricing'))).data;
const requestPromotion = async (promotionData) => {
    return (await api.post(supplierApi('/promotions/request'), promotionData)).data;
};
const getPromotionById = async (promotionId) => {
    return (await api.get(supplierApi(`/promotions/${promotionId}`))).data;
};

// --- Verification Function ---
/**
 * Submits the URLs of verification documents to the backend.
 * @param {object} docUrls - { cnicFrontUrl, cnicBackUrl, bankProofUrl }
 */
const submitVerificationDocuments = async (docUrls) => {
    // This calls the new endpoint: POST /api/verification/submit
    // Note that it does NOT use the /supplier prefix.
    return (await api.post('/verification/submit', docUrls)).data;
};

// --- File Upload Function ---
const uploadFiles = async (formData) => {
    // We create a temporary instance for file uploads that still uses our interceptor
    const uploadApi = axios.create({ baseURL: `${API_URL}/supplier` }); // Point to the /supplier path
    uploadApi.interceptors.request.use(api.interceptors.request.handlers[0].fulfilled);
    
    // The path here matches your server.js: /api/supplier/products/upload
    const response = await uploadApi.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// --- Other Functions ---
const importProductsCSV = async (products) => {
    const response = await api.post(supplierApi('/products/import'), { products });
    return response.data;
};

const getProductCartStats = async () => {
    return (await api.get(supplierApi('/products/cart-stats'))).data;
};


// --- Final Export Object ---
const supplierService = {
    getDashboardStats,
    getMyProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addVariantToProduct,
    addVariantsInBatch, // This is now correct
    getCategories,
    getMyProfile,
    updateMyProfile,
    uploadFiles,
    importProductsCSV,
    getProductCartStats,
    getMyReviews,
    getMyOrders,
    addTrackingToShipment,
    getMyPromotions,
    getPromotionPricing,
    requestPromotion,
    getPromotionById,
    
    // The new verification function is now included
    submitVerificationDocuments,
};

export default supplierService;