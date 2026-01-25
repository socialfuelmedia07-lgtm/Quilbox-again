import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { cartApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import StoreMismatchModal from "@/components/cart/StoreMismatchModal";
import { useAuth } from "./AuthContext";

export interface CartItem extends Product {
    quantity: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product, storeId?: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: (isOpen?: boolean) => void;
    cartTotal: number;
    cartCount: number;
    conflictStoreId: string | null;
    setConflictStoreId: (id: string | null) => void;
    pendingProduct: Product | null;
    setPendingProduct: (p: Product | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { toast } = useToast();

    const { isLoggedIn, openLoginModal } = useAuth();
    const [pendingProduct, setPendingProduct] = useState<{ product: Product, quantity: number } | null>(null);

    const fetchCart = async () => {
        if (!isLoggedIn) return;
        try {
            const data = await cartApi.getCart();
            if (data && data.items) {
                const transformed = data.items.map((item: any) => ({
                    ...item.product,
                    id: item.product._id || item.product.id,
                    quantity: item.quantity,
                    discountedPrice: item.price
                }));
                setCart(transformed);
            }
        } catch (e) {
            console.error("Failed to fetch cart", e);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
            // Process pending product if exists
            if (pendingProduct) {
                // Use a clean function to add without triggering new context updates immediately
                (async () => {
                    await addToCart(pendingProduct.product, undefined, pendingProduct.quantity);
                    setPendingProduct(null);
                    toast({
                        title: "Item Added",
                        description: `${pendingProduct.product.name} has been added to your cart.`,
                    });
                })();
            }
        } else {
            setCart([]);
        }
    }, [isLoggedIn]);

    const addToCart = async (product: Product, storeId?: string, quantity: number = 1) => {
        if (!isLoggedIn) {
            setPendingProduct({ product, quantity });
            openLoginModal();
            toast({
                title: "Login Required",
                description: "This item will be added automatically after you login.",
            });
            return;
        }

        try {
            const data = await cartApi.addToCart(product.id, quantity);
            const transformed = data.items.map((item: any) => ({
                ...item.product,
                id: item.product._id || item.product.id,
                quantity: item.quantity,
                discountedPrice: item.price
            }));
            setCart(transformed);
            if (!pendingProduct) { // Only show toast if it wasn't a pending auto-add
                toast({
                    title: "Added to Cart",
                    description: `${product.name} added.`,
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add to cart",
                variant: "destructive",
            });
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const data = await cartApi.removeCartItem(productId);
            const transformed = data.items.map((item: any) => ({
                ...item.product,
                id: item.product._id || item.product.id,
                quantity: item.quantity,
                discountedPrice: item.price
            }));
            setCart(transformed);
        } catch (e) {
            console.error("Failed to remove item", e);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            await removeFromCart(productId);
            return;
        }
        try {
            const data = await cartApi.updateCartItem(productId, quantity);
            const transformed = data.items.map((item: any) => ({
                ...item.product,
                id: item.product._id || item.product.id,
                quantity: item.quantity,
                discountedPrice: item.price
            }));
            setCart(transformed);
        } catch (e) {
            console.error("Failed to update quantity", e);
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clearCart();
            setCart([]);
        } catch (e) {
            console.error("Failed to clear cart", e);
        }
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
                conflictStoreId: null,
                setConflictStoreId: () => { },
                pendingProduct: null,
                setPendingProduct: () => { }
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
