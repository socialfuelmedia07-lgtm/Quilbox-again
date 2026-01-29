import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ArrowUpDown, Filter, ChevronDown, Check, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { storeApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const storeId = searchParams.get("storeId");
    const categoryName = searchParams.get("category");

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Sorting & Filtering State
    const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "popularity">("featured");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!storeId) return;
            setLoading(true);
            try {
                const data = await storeApi.getStoreProducts(storeId, {
                    search: query === "best sellers" ? undefined : query,
                    category: categoryName || (query === "best sellers" ? "Best Seller" : undefined),
                    brands: selectedBrands,
                    sort: sortBy
                });

                const allProducts = data.categories.flatMap((c: any) => c.products);
                setResults(allProducts);

                // Update available brands only if we're not currently filtering by brand
                // OR if we haven't initialized them yet. This keeps the list stable.
                if (selectedBrands.length === 0 || availableBrands.length === 0) {
                    const brands = new Set<string>();
                    // To get ALL possible brands for this context, the backend would ideally
                    // return them, but we can derive them from a non-brand-filtered fetch
                    // or just keep them from the first load of the category.
                    allProducts.forEach((p: any) => p.brand && brands.add(p.brand));
                    if (brands.size > 0) {
                        setAvailableBrands(Array.from(brands).sort());
                    }
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, storeId, categoryName, sortBy, selectedBrands]);

    // Use the persistent availableBrands list for the UI
    const allBrands = availableBrands;

    // UI results
    const processedResults = results;

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="mb-8 space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                                    {categoryName || query ? (
                                        <>Results for <span className="text-primary italic">"{categoryName || query}"</span></>
                                    ) : "All Products"}
                                </h1>
                                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                                    FOUND {processedResults.length} PRODUCTS
                                </p>
                            </div>

                            {/* Sorting & Filtering UI */}
                            <div className="flex flex-wrap items-center gap-3 py-2 border-y border-slate-100 dark:border-slate-800">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="rounded-xl h-10 gap-2 border-slate-200 font-bold text-sm bg-white dark:bg-slate-900 shadow-sm">
                                            <ArrowUpDown className="w-4 h-4 text-[#ff3366]" />
                                            Sort: {sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price: Low-High' : sortBy === 'price-high' ? 'Price: High-Low' : 'Popularity'}
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-1 rounded-xl shadow-xl border-slate-100 dark:border-slate-800" align="start">
                                        <div className="grid gap-1">
                                            {[
                                                { id: 'featured', name: 'Featured' },
                                                { id: 'price-low', name: 'Price: Low to High' },
                                                { id: 'price-high', name: 'Price: High to Low' },
                                                { id: 'popularity', name: 'By Popularity' }
                                            ].map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSortBy(option.id as any)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-colors",
                                                        sortBy === option.id ? "bg-pink-50 text-[#ff3366] dark:bg-pink-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    {option.name}
                                                    {sortBy === option.id && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="rounded-xl h-10 gap-2 border-slate-200 font-bold text-sm bg-white dark:bg-slate-900 shadow-sm">
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
                                            {selectedBrands.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-red-500"
                                                    onClick={() => setSelectedBrands([])}
                                                >
                                                    Clear All Filters
                                                </Button>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {selectedBrands.length > 0 && (
                                    <div className="flex flex-wrap gap-2 ml-auto md:ml-0">
                                        {selectedBrands.map(b => (
                                            <span key={b} className="bg-pink-100 dark:bg-pink-900/30 text-[#ff3366] text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-pink-200 dark:border-pink-800">
                                                {b}
                                                <button onClick={() => toggleBrand(b)} className="hover:text-red-700 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {processedResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                                {processedResults.map((product, index) => (
                                    <ProductCard key={product.id} {...product} delay={index * 50} storeId={storeId || undefined} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-xl font-bold text-slate-400">No products found matching your filters.</p>
                                <Button
                                    variant="link"
                                    className="mt-2 text-[#ff3366] font-black"
                                    onClick={() => {
                                        setSelectedBrands([]);
                                        setSortBy("featured");
                                    }}
                                >
                                    Reset all filters
                                </Button>
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

export default SearchPage;
