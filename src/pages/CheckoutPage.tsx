import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, ShoppingBag, Truck, Store as StoreIcon, Loader2, Navigation, Pencil, Search } from "lucide-react";

// Lazy load map to avoid SSR issues or heavy initial load
const MapPicker = lazy(() => import("@/components/MapPicker"));
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { checkoutApi } from "@/services/api";

const PRESET_LOCATIONS = [
    { name: "Navrangpura (Center)", address: "Stationary Hub, CG Road, Navrangpura, Ahmedabad 380009", lat: 23.0365, lng: 72.5611 },
    { name: "Chanakyapuri (North)", address: "Shayona City, Chanakyapuri, Ahmedabad 380061", lat: 23.0750, lng: 72.5350 },
    { name: "Prahlad Nagar (South)", address: "Titanium Corp, Prahlad Nagar, Ahmedabad 380015", lat: 23.0120, lng: 72.5108 },
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, cartCount, clearCart } = useCart();
    const { toast } = useToast();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "GPAY">("COD");

    // Address State
    const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);
    const [displayAddress, setDisplayAddress] = useState(""); // Start empty to prompt user

    // Business Logic: Charges
    const deliveryCharge = 15;
    const smallCartCharge = cartTotal < 99 ? 15 : 0;
    const finalTotal = cartTotal + deliveryCharge + smallCartCharge;

    const [previewData, setPreviewData] = useState<any>(null);
    const [loadingPreview, setLoadingPreview] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Manual Geocoding Trigger with Smart Fallback (Ahmedabad Only)
    const handleLocateAddress = async () => {
        if (!displayAddress || displayAddress.length < 3) {
            toast({
                title: "Invalid Address",
                description: "Address is too short to locate.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Locating in Ahmedabad...",
            description: "Fetching coordinates for your address.",
        });

        // Helper to fetch coordinates - RESTRICTED TO AHMEDABAD
        const searchNominatim = async (query: string) => {
            try {
                // Force "Ahmedabad" context
                let q = query;
                if (!q.toLowerCase().includes("ahmedabad")) {
                    q = `${q}, Ahmedabad`;
                }

                // Add viewbox for Ahmedabad to bias results (West: 72.4, South: 22.9, East: 72.7, North: 23.3)
                const ahmedabadViewbox = "&viewbox=72.4,22.9,72.7,23.3&bounded=1";

                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}${ahmedabadViewbox}`);
                const data = await res.json();
                return data && data.length > 0 ? data[0] : null;
            } catch (e) {
                return null;
            }
        };

        try {
            let bestMatch = await searchNominatim(displayAddress);

            // Fallback: If exact search fails, try searching just the area/pincode in Ahmedabad
            if (!bestMatch) {
                const pincodeMatch = displayAddress.match(/\b38\d{4}\b/); // Ahmedabad pincodes start with 38
                if (pincodeMatch) {
                    bestMatch = await searchNominatim(pincodeMatch[0]);
                }
            }

            if (bestMatch) {
                const lat = parseFloat(bestMatch.lat);
                const lng = parseFloat(bestMatch.lon);

                setSelectedLocation(prev => ({
                    ...prev,
                    lat,
                    lng,
                    name: "Located Address"
                }));

                toast({
                    title: "Location Confirmed",
                    description: "Address found in Ahmedabad. Store selection updated.",
                });
            } else {
                toast({
                    title: "Location Not Found",
                    description: "Could not find this address in Ahmedabad. Please check the spelling.",
                    variant: "destructive"
                });
            }
        } catch (e) {
            console.error("Geocoding failed", e);
            toast({
                title: "Error",
                description: "Failed to locate address.",
                variant: "destructive"
            });
        }
    };

    // Debounced Autocomplete Search (Ahmedabad Only)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (displayAddress.length > 2 && showSuggestions) {
                setIsSearching(true);
                try {
                    // Force Ahmedabad context in autocomplete too
                    let q = displayAddress;
                    if (!q.toLowerCase().includes("ahmedabad")) {
                        q = `${q}, Ahmedabad`;
                    }

                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5&countrycodes=in`);
                    const data = await res.json();
                    setSuggestions(data || []);
                } catch (e) {
                    console.error("Autocomplete failed", e);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 800); // 800ms debounce
        return () => clearTimeout(timer);
    }, [displayAddress, showSuggestions]);

    const handleAddressSelect = (place: any) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        // Construct a clean address string
        const addr = place.display_name;

        setSelectedLocation(prev => ({
            ...prev,
            lat,
            lng,
            name: "Selected Location"
        }));
        setDisplayAddress(addr);
        setSuggestions([]);
        setShowSuggestions(false);

        toast({
            title: "Location Updated",
            description: "Map pinned to selected address.",
        });
    };

    // Update location from MapPicker (Manual Pin Move)
    const handleMapSelect = (lat: number, lng: number) => {
        setSelectedLocation(prev => ({
            ...prev,
            lat,
            lng,
            name: "Custom Map Pin"
        }));
    };

    useEffect(() => {
        const getPreview = async () => {
            if (cart.length === 0) {
                setLoadingPreview(false);
                return;
            }

            try {
                const checkoutItems = cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity
                }));

                const userLocation = { lat: selectedLocation.lat, lng: selectedLocation.lng };
                const data = await checkoutApi.preview(checkoutItems, userLocation);
                setPreviewData(data);
                setError(null);
            } catch (err: any) {
                console.error("Preview failed", err);
                setError(err.response?.data?.message || "Something went wrong during store selection");
            } finally {
                setLoadingPreview(false);
            }
        };

        getPreview();
    }, [cart, selectedLocation]);

    const handlePlaceOrder = async () => {
        if (!displayAddress || displayAddress.length < 5) {
            toast({
                title: "Address Required",
                description: "Please enter your full delivery address.",
                variant: "destructive"
            });
            return;
        }

        setIsConfirming(true);
        try {
            const checkoutItems = cart.map(item => ({
                product: item.id,
                quantity: item.quantity
            }));

            const userLocation = { lat: selectedLocation.lat, lng: selectedLocation.lng };
            await checkoutApi.confirm(checkoutItems, userLocation, displayAddress);

            setIsOrderPlaced(true);
            toast({
                title: "Success",
                description: "Your order has been placed successfully!",
            });
            setTimeout(() => {
                clearCart();
            }, 500);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to place order",
                variant: "destructive",
            });
        } finally {
            setIsConfirming(false);
        }
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
                        <div className="bg-slate-50 p-4 rounded-xl mt-4 max-w-sm mx-auto">
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Delivering To</p>
                            <p className="text-sm font-medium text-slate-900">{displayAddress}</p>
                        </div>
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

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Header />
                <main className="container mx-auto px-4 pt-32 text-center">
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <Button onClick={() => navigate("/")} className="bg-[#ff3366]">Go Back to Shopping</Button>
                </main>
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

                    {loadingPreview ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-slate-500 font-bold animate-pulse">Selecting nearest store with stock...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Left Column: Details */}
                            <div className="space-y-6">
                                {/* Auto Store Selection */}
                                <div className="bg-[#ff3366]/5 rounded-3xl p-6 border border-[#ff3366]/10 shadow-sm overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <StoreIcon className="w-24 h-24" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#ff3366] flex items-center justify-center text-white">
                                            <StoreIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg leading-tight">Fulfilling Store</h2>
                                            <p className="text-[10px] font-black text-[#ff3366] uppercase tracking-widest leading-none">Auto Selected</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {previewData?.store?.name || "Locating..."}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Navigation className="w-3.5 h-3.5" />
                                                {previewData?.store?.distance} km away
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                                <Truck className="w-3.5 h-3.5" />
                                                ETA: {previewData?.eta}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <h2 className="font-bold text-lg">Delivery Location</h2>
                                        </div>
                                    </div>

                                    {/* Smart Autocomplete Address Input + Map */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Search Address</label>

                                            <div className="flex gap-2 items-start">
                                                <div className="flex-1 relative">
                                                    <div className="flex items-center border rounded-xl overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 transition-all border-slate-200 dark:border-slate-700 h-[60px]">
                                                        <Search className="w-5 h-5 ml-3 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={displayAddress}
                                                            onChange={(e) => {
                                                                setDisplayAddress(e.target.value);
                                                                setShowSuggestions(true);
                                                            }}
                                                            onFocus={() => setShowSuggestions(true)}
                                                            className="w-full h-full bg-transparent p-4 text-sm outline-none placeholder:text-slate-400 text-slate-900 font-bold"
                                                            placeholder="Type address (e.g. Deshna Apt, Naranpura...)"
                                                        />
                                                        {isSearching && <Loader2 className="w-4 h-4 mr-3 animate-spin text-primary" />}
                                                    </div>

                                                    {/* Blinkit-style Suggestions Dropdown */}
                                                    {showSuggestions && suggestions.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-[2000] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                                            {suggestions.map((place: any, i) => (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => handleAddressSelect(place)}
                                                                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 flex items-start gap-3 group transition-colors"
                                                                >
                                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#ff3366]/10 group-hover:text-[#ff3366] transition-colors">
                                                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-[#ff3366]" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                                                            {place.name || place.display_name.split(',')[0]}
                                                                        </p>
                                                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                                                            {place.display_name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-[10px] text-center text-slate-400 font-medium">
                                                                Powered by OpenStreetMap
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    onClick={handleLocateAddress}
                                                    className="h-[60px] w-[80px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-blue-500/20 shrink-0"
                                                    title="Force locate on map"
                                                >
                                                    <MapPin className="w-6 h-6" />
                                                    <span className="text-[10px] font-bold leading-none">Locate</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="relative h-[250px] rounded-xl overflow-hidden border border-slate-200">
                                            <Suspense fallback={<div className="h-full bg-slate-100 animate-pulse" />}>
                                                <MapPicker
                                                    onLocationSelect={handleMapSelect}
                                                    initialLat={selectedLocation.lat}
                                                    initialLng={selectedLocation.lng}
                                                />
                                            </Suspense>
                                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur p-1.5 rounded-lg text-[10px] text-center border shadow-sm z-[500] font-medium text-slate-600">
                                                Map updates when you click 'Locate'
                                            </div>
                                        </div>
                                    </div>
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
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{method.sub}</span>
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
                                        {smallCartCharge > 0 && (
                                            <div className="flex items-center justify-between text-sm animate-in fade-in">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-500 font-medium">Small Cart Fee</span>
                                                    <span className="text-[10px] text-orange-500">(Order below ₹99)</span>
                                                </div>
                                                <span className="text-orange-600 font-bold">₹{smallCartCharge}</span>
                                            </div>
                                        )}

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
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Store Information</p>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            Your order will be fulfilled by our nearest partner workshop to ensure the fastest delivery and freshest stock.
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full bg-[#ff3366] hover:bg-[#e62e5c] text-white py-8 rounded-2xl font-black text-xl tracking-tighter shadow-2xl shadow-rose/20 transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-50"
                                        onClick={handlePlaceOrder}
                                        disabled={isConfirming}
                                    >
                                        {isConfirming ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                ORDER NOW
                                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
