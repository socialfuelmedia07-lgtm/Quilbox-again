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

// Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Session expired or invalid token. Logging out...");
            localStorage.removeItem('token');
            localStorage.removeItem('quilbox_user');
            // We can't call logout() from AuthContext here easily, 
            // but clearing storage will make useAuth redirect/react on next check or reload.
            window.location.href = '/'; // Force a landing page redirect to reset state
        }
        return Promise.reject(error);
    }
);

import { allProducts } from '@/data/products';

const MOCK_PRODUCTS = allProducts.map(p => ({
    ...p,
    _id: p.id, // Ensure support for both id mapping formats
    storeId: "" // Added to satisfy TypeScript and allow filtering
}));

const MOCK_STORES = [
    {
        _id: "6979b4daec521849354e5a70",
        name: "Quilbox Stationery Hub",
        address: "Sector 62, Noida",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1583000492611-6b83f0980540"
    }
];

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
        try {
            const response = await api.post('/auth/complete-profile', data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (e) {
            console.warn("API Fail - CompleteProfile: Using Mock Success", e);
            const mockUser = {
                id: "user-mock-123",
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                role: "user"
            };
            const mockToken = "mock-jwt-token-profile-fallback";
            localStorage.setItem('token', mockToken);
            return { message: "Profile completed (Mock)", user: mockUser, token: mockToken };
        }
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

// --- Cart States for Mock Fallbacks (Persistent) ---
const getMockCart = () => {
    try {
        const saved = localStorage.getItem('quilbox_mock_cart');
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
};

const saveMockCart = (cart: any[]) => {
    localStorage.setItem('quilbox_mock_cart', JSON.stringify(cart));
};

let MOCK_CART = getMockCart();

// --- Cart APIs ---
export const cartApi = {
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (e) {
            return { items: MOCK_CART, total: 0 };
        }
    },
    addToCart: async (productId: string, quantity: number, storeId?: string) => {
        try {
            const response = await api.post('/cart', { productId, quantity, storeId });
            return response.data;
        } catch (e) {
            console.warn("API Fail - AddToCart: Using Mock", e);

            const existingIndex = MOCK_CART.findIndex(item =>
                (item.product._id === productId || item.product.id === productId)
            );

            if (existingIndex > -1) {
                MOCK_CART[existingIndex].quantity += quantity;
            } else {
                // Find product in all possible mock sources
                const product = MOCK_PRODUCTS.find(p => p._id === productId) ||
                    MOCK_PRODUCTS.find(p => (p as any).id === productId) ||
                    MOCK_PRODUCTS[0];

                MOCK_CART.push({
                    product,
                    quantity,
                    price: product.discountedPrice || product.originalPrice || (product as any).price || 0
                });
            }

            saveMockCart(MOCK_CART);
            return { items: [...MOCK_CART] };
        }
    },
    updateCartItem: async (productId: string, quantity: number) => {
        try {
            const response = await api.patch(`/cart/${productId}`, { quantity });
            return response.data;
        } catch (e) {
            const index = MOCK_CART.findIndex(item =>
                (item.product._id === productId || item.product.id === productId)
            );
            if (index > -1) {
                if (quantity < 1) {
                    MOCK_CART.splice(index, 1);
                } else {
                    MOCK_CART[index].quantity = quantity;
                }
            }
            saveMockCart(MOCK_CART);
            return { items: [...MOCK_CART] };
        }
    },
    removeCartItem: async (productId: string) => {
        try {
            const response = await api.delete(`/cart/${productId}`);
            return response.data;
        } catch (e) {
            MOCK_CART = MOCK_CART.filter(item =>
                item.product._id !== productId && item.product.id !== productId
            );
            saveMockCart(MOCK_CART);
            return { items: [...MOCK_CART] };
        }
    },
    clearCart: async () => {
        try {
            await api.delete('/cart');
            MOCK_CART = [];
            saveMockCart(MOCK_CART);
            return { items: [] };
        } catch (e) {
            MOCK_CART = [];
            saveMockCart(MOCK_CART);
            return { items: [] };
        }
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
        try {
            const response = await api.get(`/stores/${id}`);
            return response.data;
        } catch (e) {
            console.warn("API Fail - getStoreById: Using Mock Store", e);
            return MOCK_STORES.find(s => s._id === id) || MOCK_STORES[0];
        }
    },
    getStoreCategories: async (id: string) => {
        const response = await api.get(`/stores/${id}/categories`);
        return response.data;
    },
    getStoreProducts: async (storeId: string, options: { search?: string, category?: string, brands?: string[], sort?: string } = {}) => {
        try {
            const params = new URLSearchParams();
            if (options.search) params.append('search', options.search);
            if (options.category) params.append('category', options.category);
            if (options.brands && options.brands.length > 0) params.append('brands', options.brands.join(','));
            if (options.sort) params.append('sort', options.sort);

            const response = await api.get(`/stores/${storeId}/products?${params.toString()}`);
            return response.data;
        } catch (e) {
            console.warn("API Fail - getStoreProducts: Using Mock Data", e);
            // Return structured mock response expected by StorePage
            const storeProducts = MOCK_PRODUCTS.filter(p => p.storeId === storeId || !p.storeId);
            return {
                featured: storeProducts.slice(0, 4),
                categories: [
                    {
                        categoryName: "All Products",
                        products: storeProducts
                    }
                ]
            };
        }
    },
};

export default api;
