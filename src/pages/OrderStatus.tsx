import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    RotateCcw,
    ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const OrderStatusPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refunding, setRefunding] = useState(false);

    const fetchOrder = async () => {
        try {
            if (orderId) {
                const data = await orderApi.getOrderById(orderId);
                setOrder(data);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        // Poll for status updates every 10 seconds
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [orderId]);

    const handleRefund = async () => {
        setRefunding(true);
        try {
            if (orderId) {
                await orderApi.refundOrder(orderId);
                toast({
                    title: "Success",
                    description: "Order refunded successfully",
                });
                setShowRefundModal(false);
                fetchOrder();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Refund failed",
                variant: "destructive",
            });
        } finally {
            setRefunding(false);
        }
    };

    const statuses = [
        { key: "order_placed", label: "Order Placed", icon: CheckCircle2, sub: "We have received your order" },
        { key: "packed", label: "Packed", icon: Package, sub: "Your items are securely packed" },
        { key: "on_the_way", label: "On the Way", icon: Truck, sub: "Our delivery partner is nearby" },
    ];

    const getStatusIndex = (currentStatus: string) => {
        if (currentStatus === "refunded") return -1;
        return statuses.findIndex(s => s.key === currentStatus);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    const currentIndex = getStatusIndex(order.status);
    const isRefunded = order.status === "refunded";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="container mx-auto px-4 pt-[140px] md:pt-24 pb-20">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-black tracking-tight">Track Order</h1>
                    </div>

                    {/* Status Tracker */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-6 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                                <h2 className="font-bold font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</h2>
                            </div>
                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider",
                                isRefunded ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                            )}>
                                {order.status.replace("_", " ")}
                            </div>
                        </div>

                        {isRefunded ? (
                            <div className="flex flex-col items-center py-10 text-center space-y-4">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <RotateCcw className="w-10 h-10 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tighter">Order Refunded</h3>
                                    <p className="text-slate-500 text-sm">Refund has been processed. Stock returned.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                                <div className="space-y-10 relative">
                                    {statuses.map((s, idx) => {
                                        const isActive = idx <= currentIndex;
                                        const isCurrent = idx === currentIndex;
                                        const Icon = s.icon;

                                        return (
                                            <div key={s.key} className="flex gap-6 items-start">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                                                    isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className={cn(
                                                        "font-bold text-lg leading-tight",
                                                        isActive ? "text-slate-900" : "text-slate-400"
                                                    )}>
                                                        {s.label}
                                                    </span>
                                                    <span className="text-sm text-slate-500 font-medium">{s.sub}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Refund Trigger */}
                    {order.status === "on_the_way" && (
                        <div className="mb-6 animate-in slide-in-from-bottom duration-500">
                            <Button
                                onClick={() => setShowRefundModal(true)}
                                variant="outline"
                                className="w-full py-8 border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl font-black text-lg tracking-tighter overflow-hidden group transition-all"
                            >
                                <RotateCcw className="mr-2 w-5 h-5 group-hover:-rotate-45 transition-transform" />
                                REQUEST INSTANT REFUND
                            </Button>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            Order Items
                        </h3>
                        <div className="space-y-4">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        {item.product?.imageUrl && (
                                            <img src={item.product.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                                        )}
                                        <div>
                                            <p className="font-bold text-sm">{item.product?.name || 'Product'}</p>
                                            <p className="text-xs text-slate-400 font-bold">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-dashed mt-6 flex justify-between items-center">
                                <span className="font-bold text-slate-400">Total Paid</span>
                                <span className="font-black text-2xl text-primary tracking-tighter">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Refund Confirmation Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRefundModal(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-[40px] p-8 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <RotateCcw className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-2">Request Refund?</h3>
                        <p className="text-slate-500 mb-8 font-medium">Are you sure? This will cancel your order and return stock.</p>
                        <div className="space-y-3">
                            <Button
                                onClick={handleRefund}
                                disabled={refunding}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl font-black text-lg tracking-tighter"
                            >
                                {refunding ? "Processing..." : "YES, REFUND"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowRefundModal(false)}
                                className="w-full py-6 rounded-2xl font-bold text-slate-400"
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default OrderStatusPage;
