import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { storeApi } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";

interface Store {
    _id: string;
    name: string;
    description: string;
    bannerImage: string;
}

interface StoreProductsResponse {
    featured: any[];
    categories: {
        categoryName: string;
        products: any[];
    }[];
}

const StorePage = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const [store, setStore] = useState<Store | null>(null);
    const [data, setData] = useState<StoreProductsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (storeId) {
            const fetchStoreData = async () => {
                try {
                    const [storeInfo, productsData] = await Promise.all([
                        storeApi.getStoreById(storeId),
                        storeApi.getStoreProducts(storeId)
                    ]);
                    setStore(storeInfo);
                    setData(productsData);
                } catch (error) {
                    console.error("Failed to fetch store data", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStoreData();
        }
    }, [storeId]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!storeId) return;

        setIsSearching(true);
        try {
            const productsData = await storeApi.getStoreProducts(storeId, query);
            setData(productsData);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-24 container mx-auto px-4">
                    <Skeleton className="h-64 w-full rounded-2xl mb-8" />
                    <div className="space-y-12">
                        {[1, 2].map(i => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-8 w-48" />
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {[1, 2, 3, 4, 5].map(j => (
                                        <Skeleton key={j} className="h-72 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!store || !data) return <div>Store not found</div>;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12">
                {/* Store Hero - Homepage Clone Style */}
                <div className="container mx-auto max-w-7xl mb-8">
                    <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#fdf2f8] via-[#f5f3ff] to-[#f0f9ff] dark:from-slate-900 dark:to-slate-800 p-8 md:p-12 text-slate-900 dark:text-white shadow-xl border border-white/20">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            {/* Logo Box */}
                            <div className="h-20 w-20 md:h-24 md:w-24 bg-white dark:bg-black rounded-3xl overflow-hidden flex items-center justify-center shrink-0 shadow-lg border border-slate-100 dark:border-slate-800">
                                <img
                                    src={store.bannerImage || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60"}
                                    alt={store.name}
                                    className="h-full w-full object-cover p-1"
                                />
                            </div>

                            <div className="flex flex-col gap-2 text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                                    {store.name}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-bold max-w-2xl leading-snug">
                                    {store.description}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                    <span className="flex items-center gap-2 text-xs md:text-sm font-extrabold text-[#ff3366] uppercase tracking-widest">
                                        Partner Store
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                                        Quick Delivery
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories - Homepage Style */}
                <CategorySection />

                {/* Store Search */}
                <div className="container mx-auto px-4 my-10">
                    <div className="max-w-4xl mx-auto relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-[#ff3366] transition-colors" />
                        <Input
                            placeholder={`Search for items in ${store.name}...`}
                            className="pl-14 h-16 text-lg rounded-2xl border-slate-200 focus:ring-1 focus:ring-[#ff3366] shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 text-[#ff3366] w-6 h-6 animate-spin" />
                        )}
                    </div>
                </div>

                {/* Search Results / Full Store Content */}
                {searchQuery ? (
                    <div className="container mx-auto px-4">
                        <ProductSection
                            title={`Results in ${store.name}`}
                            products={data.categories.flatMap(c => c.products)}
                            showViewAll={false}
                            storeId={storeId}
                        />
                        {data.categories.length === 0 && (
                            <div className="text-center py-20 text-slate-500">
                                No products found matching your search.
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Featured Section */}
                        {data.featured.length > 0 && (
                            <ProductSection
                                title="Best Sales Products"
                                subtitle="Most loved products from this store"
                                products={data.featured}
                                isBestSeller
                                limit={20}
                                viewAllHref={`/search?storeId=${storeId}&q=best+sellers`}
                                storeId={storeId}
                            />
                        )}

                        {/* Category-wise Sections */}
                        {data.categories.map((cat, idx) => (
                            <ProductSection
                                key={idx}
                                title={cat.categoryName === 'Discounted' ? 'Top Discounted Deals' :
                                    cat.categoryName === 'Combo Offer' ? 'Value Combos' :
                                        cat.categoryName}
                                subtitle={cat.categoryName === 'Discounted' ? "Grab them before they're gone!" : ""}
                                products={cat.products}
                                limit={20}
                                viewAllHref={`/search?storeId=${storeId}&category=${cat.categoryName}`}
                                storeId={storeId}
                            />
                        ))}
                    </>
                )}
            </main>
            <Footer />
            <FloatingCartBar />
        </div>
    );
};

export default StorePage;
