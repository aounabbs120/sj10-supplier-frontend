// src/services/chatService.js
import axios from 'axios';

// The base URL for your protected chat APIs
const API_URL = 'http://localhost:4000/api/chat';

// Create a centralized Axios instance that will be used for all protected requests.
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Use the same interceptor logic from your supplierService to automatically add the auth token.
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

// --- Service Functions ---

/**
 * Fetches all chat conversations for the logged-in supplier from your backend.
 */
const getMyChats = async () => (await api.get('/')).data;

/**
 * Fetches the message history for a specific chat from your backend.
 * @param {string} chatId The ID of the chat.
 */
const getMessagesForChat = async (chatId) => (await api.get(`/${chatId}/messages`)).data;


const chatService = {
    getMyChats,
    getMessagesForChat,
};

export default chatService;