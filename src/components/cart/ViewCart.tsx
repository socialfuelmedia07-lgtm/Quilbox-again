import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import CartCard from "./CartCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ViewCart = () => {
    const { cart, isCartOpen, toggleCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        toggleCart(false);
        navigate("/checkout");
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] transition-opacity duration-300 pointer-events-none",
                isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => toggleCart(false)}
            />

            {/* Side Drawer */}
            <div
                className={cn(
                    "absolute top-0 right-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-[#ff3366]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Your Cart</h2>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{cart.length} ITEMS</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => toggleCart(false)}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {cart.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-4 pb-20">
                                {cart.map((item) => (
                                    <CartCard key={item.id} item={item} />
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Subtotal</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">₹{cartTotal}</span>
                            </div>
                            <Button
                                className="w-full bg-[#ff3366] hover:bg-[#ff1a53] text-white font-black h-14 rounded-2xl shadow-xl shadow-rose-500/20 text-lg transition-all active:scale-[0.98]"
                                onClick={handleCheckout}
                            >
                                Checkout Now
                            </Button>
                            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                                Shipping & taxes calculated at checkout
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Cart is empty</h3>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8 max-w-[200px]">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-full px-8 font-black border-2 h-12"
                            onClick={() => toggleCart(false)}
                        >
                            Start Shopping
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCart;
