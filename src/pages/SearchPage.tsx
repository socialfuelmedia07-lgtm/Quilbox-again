import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [allBackendProducts, setAllBackendProducts] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getProducts();
                const mappedProducts = data.map((p: any) => ({
                    id: p._id,
                    name: p.name,
                    image: p.imageUrl,
                    originalPrice: p.price + 50,
                    discountedPrice: p.price,
                    discount: 15,
                    category: "Writing",
                    brand: "Quilbox",
                    popularity: 80,
                    rating: 4.5
                }));
                setAllBackendProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!loading) {
            const lowerQuery = query.toLowerCase().trim();
            if (!lowerQuery) {
                setResults(allBackendProducts);
                return;
            }

            const filtered = allBackendProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(lowerQuery) ||
                    product.category.toLowerCase().includes(lowerQuery) ||
                    product.brand.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        }
    }, [query, allBackendProducts, loading]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 pt-[140px] md:pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Search Results for "{query}"
                    </h1>
                    <p className="text-muted-foreground">
                        Found {results.length} products
                    </p>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {results.map((product, index) => (
                            <ProductCard key={product.id} {...product} delay={index * 50} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400">No products found matching your search.</p>
                    </div>
                )}
            </main>
            <Footer />
            <FloatingCartBar />
        </div>
    );
};

export default SearchPage;
