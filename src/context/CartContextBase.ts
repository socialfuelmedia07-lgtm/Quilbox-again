import { createContext } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/data/products";

export interface CartContextType {
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

export const CartContext = createContext<CartContextType | undefined>(undefined);
