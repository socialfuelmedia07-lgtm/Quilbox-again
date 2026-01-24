import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { allProducts, bestSellers, discountedProducts } from "@/data/products";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState(allProducts);

    useEffect(() => {
        if (query) {
            const lowerQuery = query.toLowerCase().trim();

            // Handle special keywords
            if (lowerQuery === "best sellers" || lowerQuery === "best seller") {
                setResults(bestSellers);
                return;
            }
            if (lowerQuery === "discount" || lowerQuery === "discounts" || lowerQuery === "deals") {
                setResults(discountedProducts);
                return;
            }

            const filtered = allProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(lowerQuery) ||
                    product.category.toLowerCase().includes(lowerQuery) ||
                    product.brand.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        } else {
            setResults(allProducts);
        }
    }, [query]);

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
