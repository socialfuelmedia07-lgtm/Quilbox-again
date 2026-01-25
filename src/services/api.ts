import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to requests if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Auth APIs ---
export const authApi = {
    requestOtp: async (name: string, email: string) => {
        const response = await api.post('/auth/request-otp', { name, email });
        return response.data;
    },
    verifyOtp: async (email: string, otp: string) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },
    completeProfile: async (data: { email: string; firstName: string; lastName: string; age: number }) => {
        const response = await api.post('/auth/complete-profile', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

// --- Product APIs ---
export const productApi = {
    getProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    getProductById: async (id: string) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

// --- Cart APIs ---
export const cartApi = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },
    addToCart: async (productId: string, quantity: number) => {
        const response = await api.post('/cart', { productId, quantity });
        return response.data;
    },
    updateCartItem: async (productId: string, quantity: number) => {
        const response = await api.patch(`/cart/${productId}`, { quantity });
        return response.data;
    },
    removeCartItem: async (productId: string) => {
        const response = await api.delete(`/cart/${productId}`);
        return response.data;
    },
};

// --- Order APIs ---
export const orderApi = {
    placeOrder: async () => {
        const response = await api.post('/orders');
        return response.data;
    },
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrderById: async (id: string) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string) => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    refundOrder: async (id: string) => {
        const response = await api.post(`/orders/${id}/refund`);
        return response.data;
    },
};

export default api;
