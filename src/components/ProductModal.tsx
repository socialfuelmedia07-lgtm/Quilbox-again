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
            <DialogContent className="max-w-4xl w-[90vw] md:w-full p-0 overflow-hidden bg-white gap-0 rounded-2xl sm:rounded-3xl z-[100]">
                {/* Screen Reader Access */}
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">Product Details for {product.name}</DialogDescription>

                {/* Mobile Back Button (Top Left - Floating) */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="md:hidden absolute left-4 top-4 z-[60] p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-sm"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Desktop Close Button (Top Right - Floating) */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="hidden md:flex absolute right-6 top-6 z-[60] p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto md:overflow-hidden md:h-[600px]">


                    {/* Left Side - Image (White Background) */}
                    <div className="w-full md:w-1/2 h-64 md:h-full bg-white flex items-center justify-center p-6 md:p-8 relative shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right Side - Details (Light Background) */}
                    <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white relative">

                        {/* Badge */}
                        <div className="mb-3">
                            <span className="bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm inline-block">
                                {product.packSize || "Single Pack"}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-gray-900 leading-tight">
                            {product.name}
                        </h2>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6 md:mb-8">
                            <span className="text-3xl font-extrabold text-gray-900">₹{product.discountedPrice}</span>
                            <span className="text-lg text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
                        </div>

                        {/* Details Box */}
                        <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-6 md:mb-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Product Details</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Sketchbook, 12 Color Pencils, Sharpener.
                                Premium quality stationery item suitable for professional and student use.
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Genuine</p>
                                    <p className="text-[10px] text-gray-500">100% Authentic</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-500">In 10-15 mins</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-auto flex items-center gap-3 md:gap-4 sticky bottom-0 bg-white pt-2 pb-2 md:static md:p-0">
                            {/* Quantity Control */}
                            <div className="flex items-center justify-between border border-gray-200 rounded-lg h-12 px-4 w-32 md:w-40 hover:border-gray-300 transition-colors shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                                    className="text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-gray-400 hover:text-gray-900 transition-colors"
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
