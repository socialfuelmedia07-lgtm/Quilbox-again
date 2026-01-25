import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, ChevronDown, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CategoryPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

    // State
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState<"popularity" | "price-asc" | "price-desc">("popularity");

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

    // Derive unique brands from live data
    const brands = useMemo(() => {
        return Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
    }, [products]);

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            // Category Filter (Case insensitive check)
            if (slug && p.category?.toLowerCase() !== slug.toLowerCase()) return false;

            // Brand Filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

            // Price Filter
            const price = p.discountedPrice || p.price || 0;
            if (price < priceRange[0] || price > priceRange[1]) return false;

            return true;
        });

        // Sorting
        return result.sort((a, b) => {
            const priceA = a.discountedPrice || a.price || 0;
            const priceB = b.discountedPrice || b.price || 0;
            switch (sortBy) {
                case "price-asc":
                    return priceA - priceB;
                case "price-desc":
                    return priceB - priceA;
                case "popularity":
                default:
                    return (b.popularity || 0) - (a.popularity || 0);
            }
        });
    }, [slug, selectedBrands, priceRange, sortBy, products]);

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 pt-[140px] md:pt-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Header & Back Nav */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-2xl font-bold">{categoryName} Essentials</h1>
                        </div>

                        {/* Controls Bar: Filter & Sort */}
                        <div className="flex items-center justify-between mb-6 sticky top-20 bg-background/95 backdrop-blur z-20 py-2 border-b">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                        {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-6 space-y-8">
                                        {/* Brand Filter */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-sm">Brands</h3>
                                            <div className="space-y-2">
                                                {brands.map((brand) => (
                                                    <div key={brand} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={brand}
                                                            checked={selectedBrands.includes(brand)}
                                                            onCheckedChange={() => toggleBrand(brand)}
                                                        />
                                                        <label
                                                            htmlFor={brand}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {brand}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Filter */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-sm">Price Range</h3>
                                                <span className="text-xs text-muted-foreground">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                                            </div>
                                            <Slider
                                                defaultValue={[0, 2000]}
                                                max={2000}
                                                step={10}
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Reset Button */}
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => {
                                                setSelectedBrands([]);
                                                setPriceRange([0, 2000]);
                                            }}
                                        >
                                            Reset Filters
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        Sort by <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                                        Popularity
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
                                        Price: Low to High
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
                                        Price: High to Low
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        delay={index * 50}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                No products found matching your filters.
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
