import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingCartBar = () => {
    const { cart, cartTotal, toggleCart, cartCount } = useCart();

    if (cart.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4 animate-fade-in-up pointer-events-none">
            <div className="container mx-auto max-w-2xl pointer-events-auto">
                <div className={cn(
                    "flex items-center justify-between p-2 pl-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                                {cartCount} {cartCount === 1 ? 'item' : 'items'}
                            </span>
                            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                ₹{cartTotal}
                            </span>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => toggleCart(true)}
                        className="bg-[#ff0000] hover:bg-[#e60000] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                    >
                        View Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FloatingCartBar;
