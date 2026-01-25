import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { cartApi } from "@/services/api";
import { useAuth } from "./AuthContext";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: (isOpen?: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from backend if logged in, else localStorage
    useEffect(() => {
        const fetchCart = async () => {
            if (isLoggedIn) {
                try {
                    const backendCart = await cartApi.getCart();
                    // Transform backend items to frontend items
                    const formattedItems = backendCart.items.map((item: any) => ({
                        ...item.product,
                        id: item.product._id,
                        quantity: item.quantity,
                        discountedPrice: item.price
                    }));
                    setCart(formattedItems);
                } catch (e) {
                    console.error("Failed to fetch backend cart");
                }
            } else {
                const savedCart = localStorage.getItem("quilbox-cart");
                if (savedCart) {
                    try {
                        setCart(JSON.parse(savedCart));
                    } catch (e) {
                        console.error("Failed to parse cart from local storage");
                    }
                }
            }
        };

        fetchCart();
    }, [isLoggedIn]);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("quilbox-cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = async (product: Product) => {
        if (isLoggedIn) {
            try {
                await cartApi.addToCart(product.id, 1);
            } catch (e) {
                console.error("Failed to add to backend cart");
            }
        }
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = async (productId: string) => {
        if (isLoggedIn) {
            try {
                await cartApi.removeCartItem(productId);
            } catch (e) {
                console.error("Failed to remove from backend cart");
            }
        }
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        if (isLoggedIn) {
            try {
                await cartApi.updateCartItem(productId, quantity);
            } catch (e) {
                console.error("Failed to update backend cart");
            }
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleCart = (isOpen?: boolean) => {
        setIsCartOpen((prev) => (isOpen !== undefined ? isOpen : !prev));
    };

    const cartTotal = cart.reduce(
        (total, item) => total + item.discountedPrice * item.quantity,
        0
    );

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
