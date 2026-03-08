import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear user info and redirect to login
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========== Products API ==========
export const getProducts = async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
};

export const createProductReview = async (productId, reviewData) => {
    const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
    return response.data;
};

// ========== Categories API ==========
export const getCategories = async () => {
    const response = await api.get('/api/categories');
    return response.data;
};

export const getCategoryById = async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
};

// ========== Cart API ==========
export const getCart = async () => {
    const response = await api.get('/api/cart');
    return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post('/api/cart', { productId, quantity });
    return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await api.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
};

export const removeFromCart = async (itemId) => {
    const response = await api.delete(`/api/cart/${itemId}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await api.delete('/api/cart');
    return response.data;
};

// ========== Orders API ==========
export const createOrder = async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get('/api/orders/myorders');
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
};

export default api;
