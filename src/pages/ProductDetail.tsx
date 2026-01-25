import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // Find product
    const product = allProducts.find((p) => p.id === id);

    useEffect(() => {
        if (!product) {
            // Optional: Redirect or just stay on 404 view if handled within render
        }
        window.scrollTo(0, 0);
    }, [id, product]);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <Button onClick={() => navigate("/")} variant="primary">
                        Return to Home
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = () => {
        setIsAdding(true);
        // Add quantity times
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-24 md:py-32">
                <Button
                    variant="ghost"
                    className="mb-8 pl-0 hover:pl-2 transition-all gap-2"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border p-8 flex items-center justify-center relative group">
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                {product.discount && (
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        {product.discount}% OFF
                                    </span>
                                )}
                                {product.packSize && (
                                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm border border-border/50">
                                        {product.packSize}
                                    </span>
                                )}
                            </div>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-auto">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-foreground ml-1">{product.rating}</span>
                                </div>
                                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                <span className="text-muted-foreground">{product.brand}</span>
                            </div>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-bold text-primary">
                                    ₹{product.discountedPrice}
                                </span>
                                {product.originalPrice !== product.discountedPrice && (
                                    <span className="text-xl text-muted-foreground line-through decoration-2">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Experience premium quality with our {product.name}. Perfect for your
                                    {product.category.toLowerCase()} needs. Designed for durability and performance.
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                    {[
                                        "Premium Quality Materials",
                                        "Durable Construction",
                                        "Exclusive Design",
                                        "Money Back Guarantee"
                                    ].map((feat) => (
                                        <li key={feat} className="flex items-center gap-2 text-sm text-foreground/80">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 pt-8 border-t border-border mt-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-4 bg-secondary rounded-xl p-2 sm:max-w-[150px] justify-between">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-10 w-10 rounded-lg hover:bg-background shadow-sm"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xl font-bold tab-nums w-8 text-center">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-10 w-10 rounded-lg hover:bg-background shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className={cn(
                                        "flex-1 gap-3 text-lg h-14",
                                        isAdding && "scale-[0.98] opacity-90"
                                    )}
                                    onClick={handleAddToCart}
                                >
                                    {isAdding ? (
                                        <>
                                            <Check className="w-5 h-5 animate-scale-in" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
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

export default ProductDetail;
