import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, ChevronDown, ArrowLeft, Loader2, Check, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CategoryPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

    // State
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"popularity" | "price-low" | "price-high">("popularity");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productApi.getProducts();
                const transformed = data.map((p: any) => ({
                    ...p,
                    id: p._id || p.id,
                    image: p.imageUrl || p.image
                }));
                setProducts(transformed);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Derive unique brands from results
    const allBrands = useMemo(() => {
        const brands = new Set<string>();
        products.forEach(p => {
            if (slug && p.category?.toLowerCase() === slug.toLowerCase()) {
                if (p.brand) brands.add(p.brand);
            }
        });
        return Array.from(brands).sort();
    }, [products, slug]);

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            if (slug && p.category?.toLowerCase() !== slug.toLowerCase()) return false;
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
            return true;
        });

        return result.sort((a, b) => {
            const priceA = a.discountedPrice || a.originalPrice || a.price || 0;
            const priceB = b.discountedPrice || b.originalPrice || b.price || 0;
            switch (sortBy) {
                case "price-low":
                    return priceA - priceB;
                case "price-high":
                    return priceB - priceA;
                case "popularity":
                default:
                    return (b.popularity || 0) - (a.popularity || 0);
            }
        });
    }, [slug, selectedBrands, sortBy, products]);

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 pt-[140px] md:pt-32">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {categoryName}
                                    </h1>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">
                                        FOUND {filteredProducts.length} PRODUCTS
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Brand Filter */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 gap-2 font-bold px-4">
                                            <Filter className="w-4 h-4 text-[#ff3366]" />
                                            Brand {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800" align="start">
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Filter by Brand</div>
                                            {allBrands.length > 0 ? (
                                                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                                                    {allBrands.map(brand => (
                                                        <button
                                                            key={brand}
                                                            onClick={() => toggleBrand(brand)}
                                                            className={cn(
                                                                "flex items-center justify-between w-full px-3 py-2 text-sm font-bold rounded-lg transition-colors",
                                                                selectedBrands.includes(brand) ? "bg-pink-50 text-[#ff3366] dark:bg-pink-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                            )}
                                                        >
                                                            {brand}
                                                            {selectedBrands.includes(brand) && <Check className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-1 py-4 text-xs font-bold text-slate-400 italic">No brands available</div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Sort Menu */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 gap-2 font-bold px-4">
                                            <ArrowUpDown className="w-4 h-4 text-[#ff3366]" />
                                            {sortBy === "popularity" ? "Popularity" : sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800" align="end">
                                        <div className="space-y-1">
                                            {[
                                                { id: "popularity", label: "Popularity" },
                                                { id: "price-low", label: "Price: Low to High" },
                                                { id: "price-high", label: "Price: High to Low" }
                                            ].map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSortBy(option.id as any)}
                                                    className={cn(
                                                        "w-full px-3 py-2.5 text-sm font-bold text-left rounded-lg transition-colors flex items-center justify-between",
                                                        sortBy === option.id ? "bg-slate-50 text-[#ff3366] dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    {option.label}
                                                    {sortBy === option.id && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {selectedBrands.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-500"
                                        onClick={() => setSelectedBrands([])}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        delay={index * 50}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                                        <X className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">No products found</h3>
                                        <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                            We couldn't find any products in your selected combination.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="rounded-full px-6 font-bold" onClick={() => setSelectedBrands([])}>
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
            <FloatingCartBar />
        </div>
    );
};

export default CategoryPage;
