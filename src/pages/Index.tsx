import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts();
        // Map backend fields to frontend fields
        const mappedProducts = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          image: p.imageUrl,
          originalPrice: p.price + 50, // Mock discount for UI
          discountedPrice: p.price,
          discount: 15,
          category: "Writing", // Default category
          brand: "Quilbox"
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[105px] md:pt-0">
        <HeroSection />

        {/* 1. Categories */}
        <CategorySection />

        {/* 2. Real Products from DB */}
        <ProductSection
          title="Our Exclusive Collection"
          subtitle="Real products from our database ready for checkout!"
          products={products}
          isBestSeller
          viewAllHref="/search"
        />

        {/* Optional: Fallback to some static sections or just show one big section for now */}
      </main>
      <Footer />
      <FloatingCartBar />
    </div>
  );
};

export default Index;
