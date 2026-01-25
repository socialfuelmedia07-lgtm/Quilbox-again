import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { allProducts, bestSellers, discountedProducts } from "@/data/products";

import { storeApi } from "@/services/api";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const storeId = searchParams.get("storeId");
    const categoryName = searchParams.get("category");

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (storeId) {
                    // Fetch all products for this store
                    const data = await storeApi.getStoreProducts(storeId);
                    let filtered: any[] = [];

                    if (categoryName) {
                        const cat = data.categories.find((c: any) => c.categoryName === categoryName);
                        filtered = cat ? cat.products : [];
                    } else if (query === "best sellers" || query === "best seller") {
                        filtered = data.featured;
                    } else {
                        // General search within store
                        const allStoreProducts = [
                            ...data.featured,
                            ...data.categories.flatMap((c: any) => c.products)
                        ];
                        // Remove duplicates by ID
                        const uniqueMap = new Map();
                        allStoreProducts.forEach(p => uniqueMap.set(p.id, p));
                        filtered = Array.from(uniqueMap.values());
                    }
                    const transformedResults = filtered.map((p: any) => ({
                        ...p,
                        id: p._id || p.id,
                        image: p.imageUrl || p.image
                    }));
                    setResults(transformedResults);
                } else if (query) {
                    const lowerQuery = query.toLowerCase().trim();

                    if (lowerQuery === "best sellers" || lowerQuery === "best seller") {
                        setResults(bestSellers);
                    } else if (lowerQuery === "discount" || lowerQuery === "discounts" || lowerQuery === "deals") {
                        setResults(discountedProducts);
                    } else {
                        const filtered = allProducts.filter(
                            (product) =>
                                product.name.toLowerCase().includes(lowerQuery) ||
                                product.category.toLowerCase().includes(lowerQuery) ||
                                product.brand.toLowerCase().includes(lowerQuery)
                        );
                        setResults(filtered);
                    }
                } else {
                    setResults(allProducts);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, storeId, categoryName]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 pt-[140px] md:pt-24 pb-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                {categoryName || query ? (
                                    <>Results for <span className="text-primary">"{categoryName || query}"</span></>
                                ) : "All Products"}
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                Found {results.length} products
                            </p>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                                {results.map((product, index) => (
                                    <ProductCard key={product.id} {...product} delay={index * 50} storeId={storeId || undefined} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400">No products found matching your search.</p>
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
