import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShieldCheck, Zap, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductModalProps {
    product: Product;
    trigger: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProductModal = ({ product, trigger, open, onOpenChange }: ProductModalProps) => {
    const [quantity, setQuantity] = useState(0);
    const { addToCart } = useCart();

    // Reset quantity to 0 when modal opens
    useEffect(() => {
        if (open) {
            setQuantity(0);
        }
    }, [open]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw] md:w-full p-0 overflow-hidden bg-white dark:bg-slate-900 border-none gap-0 rounded-2xl sm:rounded-3xl z-[100] shadow-2xl [&>button:not(.group)]:hidden">
                {/* Screen Reader Access */}
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">Product Details for {product.name}</DialogDescription>

                {/* Enhanced Close Button (Top Right) */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 z-[60] p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all group"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6 text-slate-900 dark:text-white group-active:scale-90 transition-transform" />
                </button>

                {/* Mobile Back Button (Top Left) - Optional fallback */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="md:hidden absolute left-4 top-4 z-[60] p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-sm"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>


                <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden md:h-[600px] bg-white dark:bg-slate-900">


                    {/* Left Side - Image (White Background) */}
                    <div className="w-full md:w-1/2 h-64 md:h-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-6 md:p-8 relative shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right Side - Details (Light Background) */}
                    <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white dark:bg-slate-900 relative">

                        {/* Badge */}
                        <div className="mb-3">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm inline-block">
                                {product.packSize || "Single Pack"}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-slate-900 dark:text-white leading-tight">
                            {product.name}
                        </h2>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6 md:mb-8">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{product.discountedPrice}</span>
                            <span className="text-lg text-slate-400 dark:text-slate-500 line-through font-medium">₹{product.originalPrice}</span>
                        </div>

                        {/* Details Box */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 md:p-5 mb-6 md:mb-8 border border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Product Details</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Sketchbook, 12 Color Pencils, Sharpener.
                                Premium quality stationery item suitable for professional and student use.
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Genuine</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">100% Authentic</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Fast Delivery</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">In 10-15 mins</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-auto flex items-center gap-3 md:gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-2 pb-2 md:static md:p-0">
                            {/* Quantity Control */}
                            <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg h-12 px-4 w-32 md:w-40 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Add Button */}
                            <Button
                                className="flex-1 h-12 text-white text-base font-bold rounded-lg bg-[#ff3366] hover:bg-[#ff3366]/90 shadow-md shadow-pink-500/20"
                                onClick={handleAddToCart}
                                disabled={quantity === 0}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;
