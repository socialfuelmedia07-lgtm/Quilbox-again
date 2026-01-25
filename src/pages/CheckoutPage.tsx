import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { orderApi } from "@/services/api";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, cartCount, clearCart } = useCart();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "GPAY">("COD");
    const [address, setAddress] = useState("123 Stationery St, Mumbai, Maharashtra 400001");
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const deliveryCharge = 40;
    const finalTotal = cartTotal + deliveryCharge;

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Call real backend API
            const response = await orderApi.placeOrder();

            toast({
                title: "Order Successful",
                description: "Your stationery is being packed!",
            });

            // Clear local cart
            clearCart();

            // Redirect to status page
            navigate(`/order-status/${response._id}`);
        } catch (error: any) {
            toast({
                title: "Order Failed",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

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
                                        Once the order is placed and the delivery partner is on the way, you can request a refund. Instant refund available after dispatch.
                                    </p>
                                </div>

                                <Button
                                    disabled={loading || cartCount === 0}
                                    className="w-full bg-[#ff3366] hover:bg-[#e62e5c] text-white py-8 rounded-2xl font-black text-xl tracking-tighter shadow-2xl shadow-rose/20 transition-all hover:scale-[1.02] active:scale-95 group"
                                    onClick={handlePlaceOrder}
                                >
                                    {loading ? "PLACING ORDER..." : "PLACE ORDER"}
                                    {!loading && <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>}
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
