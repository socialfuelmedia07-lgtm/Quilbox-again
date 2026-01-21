import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleCart: (isOpen?: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("quilbox-cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage");
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("quilbox-cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
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
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
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
