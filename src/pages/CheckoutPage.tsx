import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, cartCount, clearCart } = useCart();
    const { toast } = useToast();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "GPAY">("COD");
    const [address, setAddress] = useState("123 Stationery St, Mumbai, Maharashtra 400001");
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const deliveryCharge = 40;
    const finalTotal = cartTotal + deliveryCharge;

    const handlePlaceOrder = () => {
        if (paymentMethod !== "COD") {
            // Mock payment process
            toast({
                title: "Processing Payment",
                description: "Redirecting to payment gateway...",
            });
        }

        // Mock success
        setTimeout(() => {
            setIsOrderPlaced(true);
            clearCart();
        }, 1000);
    };

    if (isOrderPlaced) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ORDER PLACED!</h1>
                        <p className="text-slate-500 font-medium">Your premium stationery is on its way.</p>
                    </div>
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-[#ff3366] hover:bg-[#e62e5c] text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-xl shadow-rose/20 transition-all hover:scale-105"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="container mx-auto px-4 pt-[140px] md:pt-24 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Details */}
                        <div className="space-y-6">
                            {/* Address Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <h2 className="font-bold text-lg">Delivery Address</h2>
                                    </div>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-primary font-bold"
                                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                                    >
                                        {isEditingAddress ? "Save" : "Change"}
                                    </Button>
                                </div>

                                {isEditingAddress ? (
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm outline-none border border-slate-200 dark:border-slate-700 focus:border-primary transition-colors min-h-[100px]"
                                    />
                                ) : (
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {address}
                                    </p>
                                )}
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <h2 className="font-bold text-lg">Payment Method</h2>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { id: "COD", label: "Cash on Delivery", sub: "Pay when you receive" },
                                        { id: "UPI", label: "UPI", sub: "Pay with any UPI App" },
                                        { id: "GPAY", label: "Google Pay", sub: "Fast and Secure" },
                                    ].map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                                                paymentMethod === method.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{method.label}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{method.sub}</span>
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                paymentMethod === method.id ? "border-primary bg-primary" : "border-slate-300"
                                            )}>
                                                {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Bill Summary */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
                                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    Bill Details
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Item Total ({cartCount})</span>
                                        <span className="font-bold">₹{cartTotal}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 font-medium flex items-center gap-1">
                                            Delivery Charges <Truck className="w-3 h-3" />
                                        </span>
                                        <span className="text-green-600 font-bold">₹{deliveryCharge}</span>
                                    </div>
                                    <div className="border-t border-dashed pt-4 flex items-center justify-between">
                                        <span className="font-black text-xl tracking-tighter">To Pay</span>
                                        <span className="font-black text-2xl tracking-tighter text-primary">₹{finalTotal}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Refund Policy</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Once the order is placed and the delivery partner is on the way, you cannot cancel the order. No refunds after dispatch.
                                    </p>
                                </div>

                                <Button
                                    className="w-full bg-[#ff3366] hover:bg-[#e62e5c] text-white py-8 rounded-2xl font-black text-xl tracking-tighter shadow-2xl shadow-rose/20 transition-all hover:scale-[1.02] active:scale-95 group"
                                    onClick={handlePlaceOrder}
                                >
                                    ORDER NOW
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
