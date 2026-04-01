// src/services/supplierService.js

import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403) && error.response.data.type !== 'ACCESS_DENIED_DEBT') {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const markOrderAsSeen = async (orderId) => (await api.put(`/orders/${orderId}/seen`)).data;
const supplierApi = (endpoint) => `/supplier${endpoint}`;

const supplierService = {
    // This is the function SWR uses to call your new backend routes. It's correct.
    genericGet: async (url) => (await api.get(url)).data,

    getDashboardStats: async () => (await api.get(supplierApi('/dashboard-stats'))).data,
    getMyProfile: async () => (await api.get(supplierApi('/profile'))).data,
    updateMyProfile: async (profileData) => (await api.put(supplierApi('/profile'), profileData)).data,
    getMyProducts: async () => (await api.get(supplierApi('/products'))).data,
    getProductById: async (productId) => (await api.get(supplierApi(`/products/${productId}`))).data,
    createProduct: async (productData) => (await api.post(supplierApi('/products'), productData)).data,
   updateProduct: async (productId, productData, shardKey) => (
    // Combine the product data and the shardKey into one payload
    await api.put(supplierApi(`/products/${productId}`), { ...productData, shardKey })
).data,
  // REPLACE the deleteProduct function in supplierService.js

deleteProduct: async (productId, shardKey) => (
    await api.delete(supplierApi(`/products/${productId}`), { 
        // Send the shardKey in the data payload of the DELETE request
        data: { shardKey } 
    })
).data,
    getCategories: async () => (await api.get(supplierApi('/categories'))).data,
    addVariantsInBatch: async (productId, variantsArray) => (await api.post(supplierApi(`/products/${productId}/variants/batch`), { variants: variantsArray })).data,
    uploadFiles: async (formData) => (await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data,
    uploadVideo: async (formData) => (await axios.post(`${API_BASE_URL}/api/supplier/products/upload-video`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data,
    getMyOrders: async () => (await api.get('/orders')).data,
    getMyOrderDetails: async (orderId) => (await api.get(`/orders/${orderId}`)).data,
    addTrackingToShipment: async (shipmentId, trackingData) => (await api.put(`/orders/shipments/${shipmentId}/track`, trackingData)).data,
    submitCommissionProof: async (formData) => (await api.post('/payments/proof/commission', formData, { headers: { 'Content-Type': 'multipart/form-data' }})).data,
    submitPromotionProof: async (formData) => (await api.post('/payments/proof/promotion', formData, { headers: { 'Content-Type': 'multipart/form-data' }})).data,
    getMyFollowers: async () => (await api.get('/social/followers')).data,
    getMyReviews: async () => (await api.get('/reviews')).data,
    getMyPromotions: async () => (await api.get('/promotions')).data,
    getPromotionPricing: async () => (await api.get('/promotions/pricing')).data,
    requestPromotion: async (promotionData) => (await api.post('/promotions/request', promotionData)).data,
    getPromotionById: async (promotionId) => (await api.get(`/promotions/${promotionId}`)).data,
    submitVerificationDocuments: async (docUrls) => (await axios.post(`${API_BASE_URL}/api/verification/submit`, docUrls, { headers: { 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data,
    getVapidPublicKey: async () => (await api.get(supplierApi('/vapid-public-key'))).data,
    saveSubscription: async (subscription) => (await api.post(supplierApi('/subscribe'), { subscription })).data,
    markOrderAsSeen: markOrderAsSeen 
};

export default supplierService;