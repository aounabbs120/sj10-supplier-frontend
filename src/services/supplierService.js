// src/services/supplierService.js
import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4007';
// 🟢 NEW: Separate URL specifically for heavy uploads (Oracle server)
const UPLOAD_API_URL = process.env.REACT_APP_UPLOAD_API_URL || 'http://localhost:4000';
const genericGet = async (url) => (await api.get(url)).data;
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});
const supplierApi = (endpoint) => `/suppliers${endpoint}`;
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

// 🟢 FIX: Ensure all routes match your new Vercel server.js structure
const supplierService = {
  // 🟢 services/supplierService.js mein is line ko replace karein:
getDashboardStats: (range = 'WEEK', chartOnly = false) => api.get(`/suppliers/dashboard-stats?range=${range}&chartOnly=${chartOnly}`).then(res => res.data),
    getMyProfile: async () => (await api.get('/suppliers/profile')).data,
    updateMyProfile: async (profileData) => (await api.put('/suppliers/profile', profileData)).data,
    getMyProducts: async () => (await api.get('/suppliers/products')).data,
    getProductById: async (productId) => (await api.get(`/suppliers/products/${productId}`)).data,
    createProduct: async (productData) => (await api.post('/suppliers/products', productData)).data,
    updateProduct: async (productId, productData) => (await api.put(`/suppliers/products/${productId}`, productData)).data,
    deleteProduct: async (productId, shardKey) => (await api.delete(`/suppliers/products/${productId}`, { data: { shardKey } })).data,
    getCategories: async () => (await api.get('/suppliers/categories')).data,
    addVariantsInBatch: async (productId, variantsArray) => (await api.post(`/suppliers/products/${productId}/variants/batch`, { variants: variantsArray })).data,
    
    // 🟢 FIX: UPLOAD routes now point directly to UPLOAD_API_URL (Oracle: 4000)
    uploadFiles: async (formData) => (await axios.post(`${UPLOAD_API_URL}/api/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data,
    uploadVideo: async (formData) => (await axios.post(`${UPLOAD_API_URL}/api/upload-video`, formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('supplierToken')}` }})).data,

    getMyOrders: async () => (await api.get('/orders')).data,
    getMyOrderDetails: async (orderId) => (await api.get(`/orders/${orderId}`)).data,
    addTrackingToShipment: async (shipmentId, trackingData) => (await api.put(`/orders/shipments/${shipmentId}/track`, trackingData)).data,
    payCommission: async (orderId) => (await api.post('/orders/pay-commission', { orderId })).data,
    
    submitCommissionProof: async (formData) => (await api.post('/payments/proof/commission', formData, { headers: { 'Content-Type': 'multipart/form-data' }})).data,
    submitPromotionProof: async (formData) => (await api.post('/payments/proof/promotion', formData, { headers: { 'Content-Type': 'multipart/form-data' }})).data,

    getMyFollowers: async () => (await api.get('/social/followers')).data,
    getNotificationHistory: async () => (await api.get('/notifications')).data,
    markNotificationsRead: async () => (await api.put('/notifications/read')).data,
    getMyReviews: async () => (await api.get('/reviews')).data,
    getMyPromotions: async () => (await api.get('/promotions')).data,
    getPromotionPricing: async () => (await api.get('/promotions/pricing')).data,
    requestPromotion: async (promotionData) => (await api.post('/promotions/request', promotionData)).data,
    getPromotionById: async (promotionId) => (await api.get(`/promotions/${promotionId}`)).data,
    submitVerificationDocuments: async (docUrls) => (await api.post(`/verification/submit`, docUrls)).data,
    getMyProductsPaginated: async (page = 1, search = '', status = 'all') => 
    (await api.get(`/suppliers/products/paginated?page=${page}&search=${search}&status=${status}`)).data,
    getVapidPublicKey: async () => (await api.get('/suppliers/vapid-public-key')).data,
    saveSubscription: async (subscription) => (await api.post('/suppliers/subscribe', { subscription })).data,
    genericGet, // 👈 Yeh yahan hona chahiye
    markOrderAsSeen: async (orderId) => (await api.put(`/orders/${orderId}/seen`)).data
};

export default supplierService;