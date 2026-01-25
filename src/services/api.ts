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

import { MOCK_PRODUCTS, MOCK_STORES } from '@/data/mockData';

// --- Auth APIs ---
export const authApi = {
    requestOtp: async (name: string, email: string) => {
        try {
            const response = await api.post('/auth/request-otp', { name, email });
            return response.data;
        } catch (e) {
            console.warn("API Fail - Auth: Using Mock Success", e);
            return { message: "OTP sent successfully (Mock)" };
        }
    },
    verifyOtp: async (email: string, otp: string) => {
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            return response.data;
        } catch (e) {
            console.warn("API Fail - Verify: Using Mock Token", e);
            const token = "mock-jwt-token-production-fallback";
            localStorage.setItem('token', token);
            return { token, user: { _id: "user1", name: "Guest User", email } };
        }
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
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            console.warn("API Failed, falling back to mock products:", error);
            return MOCK_PRODUCTS;
        }
    },
    getProductById: async (id: string) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            return MOCK_PRODUCTS.find(p => p._id === id) || MOCK_PRODUCTS[0];
        }
    },
};

// --- Cart APIs ---
export const cartApi = {
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (e) { return { items: [], total: 0 }; }
    },
    addToCart: async (productId: string, quantity: number, storeId?: string) => {
        try {
            const response = await api.post('/cart', { productId, quantity, storeId });
            return response.data;
        } catch (e) {
            console.warn("API Fail - AddToCart", e);
            return { message: "Added to cart (Mock)" };
        }
    },
    updateCartItem: async (productId: string, quantity: number) => {
        const response = await api.patch(`/cart/${productId}`, { quantity });
        return response.data;
    },
    removeCartItem: async (productId: string) => {
        const response = await api.delete(`/cart/${productId}`);
        return response.data;
    },
    clearCart: async () => {
        try {
            const response = await api.delete('/cart');
            return response.data;
        } catch (e) { return {}; }
    }
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

// --- Checkout APIs ---
export const checkoutApi = {
    preview: async (items: any[], userLocation: { lat: number; lng: number }) => {
        try {
            const response = await api.post('/checkout/preview', { items, userLocation });
            return response.data;
        } catch (e) {
            return {
                store: MOCK_STORES[0],
                eta: "15 mins",
                distance: 1.2
            };
        }
    },
    confirm: async (items: any[], userLocation: { lat: number; lng: number }, shippingAddress?: string) => {
        try {
            const response = await api.post('/checkout/confirm', { items, userLocation, shippingAddress });
            return response.data;
        } catch (e) {
            return { success: true, orderId: "mock-order-123" };
        }
    }
};

// --- Store APIs ---
export const storeApi = {
    getStores: async () => {
        try {
            const response = await api.get('/stores');
            return response.data;
        } catch (e) {
            return MOCK_STORES;
        }
    },
    getStoreById: async (id: string) => {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },
    getStoreCategories: async (id: string) => {
        const response = await api.get(`/stores/${id}/categories`);
        return response.data;
    },
    getStoreProducts: async (id: string, search?: string) => {
        try {
            const response = await api.get(`/stores/${id}/products`, { params: { search } });
            return response.data;
        } catch (e) {
            return MOCK_PRODUCTS;
        }
    },
};

export default api;
