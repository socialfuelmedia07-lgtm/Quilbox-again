import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { CartItem } from "@/types/cart";
import { cartApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { CartContext } from "./CartContextBase";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [conflictStoreId, setConflictStoreId] = useState<string | null>(null);
    const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const { isLoggedIn, openLoginModal } = useAuth();
    const [authPendingProduct, setAuthPendingProduct] = useState<{ product: Product, quantity: number } | null>(null);

    // Track latest request per product to prevent UI jitters
    const lastRequestTime = useRef<Record<string, number>>({});

    const fetchCart = async () => {
        if (!isLoggedIn) return;
        try {
            const data = await cartApi.getCart();
            if (data && data.items) {
                setCart(transformCartItems(data.items));
            }
        } catch (e) {
            console.error("Failed to fetch cart", e);
        }
    };

    const transformCartItems = (items: any[]): CartItem[] => {
        return items.map((item: any) => {
            const product = item.product || {};
            return {
                ...product,
                id: product._id || product.id || "",
                name: product.name || "Unknown Product",
                image: product.imageUrl || product.image || "",
                quantity: item.quantity || 0,
                originalPrice: Number(product.price || product.originalPrice || item.price || 0),
                discountedPrice: Number(item.price || product.discountPrice || product.discountedPrice || product.price || 0)
            };
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
            if (authPendingProduct) {
                (async () => {
                    await addToCart(authPendingProduct.product, undefined, authPendingProduct.quantity);
                    setAuthPendingProduct(null);
                })();
            }
        } else {
            setCart([]);
        }
    }, [isLoggedIn]);

    const addToCart = async (product: Product, storeId?: string, quantity: number = 1) => {
        if (!isLoggedIn) {
            setAuthPendingProduct({ product, quantity });
            openLoginModal();
            toast({
                title: "Login Required",
                description: "This item will be added automatically after you login.",
            });
            return;
        }

        // --- Store Mismatch Check ---
        const firstItem = cart[0];
        if (firstItem && storeId && (firstItem as any).storeId && (firstItem as any).storeId !== storeId) {
            setConflictStoreId(storeId);
            setPendingProduct(product);
            return;
        }

        // --- Optimistic Update ---
        const prevCart = [...cart];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
        } else {
            setCart([...cart, { ...product, quantity }]);
        }

        try {
            await cartApi.addToCart(product.id, quantity);
            await fetchCart(); // Refresh from server truth
            if (!authPendingProduct) {
                toast({ title: "Updated Cart", description: `${product.name} quantity updated.` });
            }
        } catch (error: any) {
            setCart(prevCart); // Rollback on error
            console.error("Failed to add to cart", error);
        }
    };

    const removeFromCart = async (productId: string) => {
        const prevCart = [...cart];
        setCart(cart.filter(item => item.id !== productId));

        try {
            await cartApi.removeCartItem(productId);
            await fetchCart(); // Refresh from server truth
        } catch (e) {
            setCart(prevCart); // Rollback
            console.error("Failed to remove item", e);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            await removeFromCart(productId);
            return;
        }

        const prevCart = [...cart];
        setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));

        try {
            await cartApi.updateCartItem(productId, quantity);
            await fetchCart(); // Refresh from server truth
        } catch (e) {
            setCart(prevCart); // Rollback
            console.error("Failed to update quantity", e);
        }
    };

    const clearCart = async () => {
        const prevCart = [...cart];
        setCart([]);

        try {
            await cartApi.clearCart();
        } catch (e) {
            setCart(prevCart); // Rollback
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
                conflictStoreId,
                setConflictStoreId,
                pendingProduct,
                setPendingProduct
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
