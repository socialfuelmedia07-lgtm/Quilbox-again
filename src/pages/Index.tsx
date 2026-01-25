import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";

const Index = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
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
          originalPrice: p.price + Math.floor(Math.random() * 100 + 20),
          discountedPrice: p.price,
          discount: 15,
          category: p.category || "Writing",
          brand: "Quilbox",
          popularity: Math.floor(Math.random() * 100)
        }));
        setAllProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products for different sections
  const bestSellers = useMemo(() => [...allProducts].sort((a, b) => b.popularity - a.popularity).slice(0, 8), [allProducts]);
  const discountedProducts = useMemo(() => allProducts.slice(0, 8), [allProducts]); // Or sort by discount
  const notebooks = useMemo(() => allProducts.filter(p => p.category === "Notebooks"), [allProducts]);
  const writingEssentials = useMemo(() => allProducts.filter(p => p.category === "Writing"), [allProducts]);
  const artSupplies = useMemo(() => allProducts.filter(p => p.category === "Art"), [allProducts]);
  const combos = useMemo(() => allProducts.filter(p => p.category === "Combo"), [allProducts]);

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

        {/* 2. Best Sellers */}
        <ProductSection
          title="Best Sales Products"
          products={bestSellers}
          isBestSeller
          viewAllHref="/search?q=best+sellers"
        />

        {/* 3. Discounted Products */}
        <ProductSection
          title="Top Discounted Deals"
          subtitle="Grab them before they're gone!"
          products={discountedProducts}
          viewAllHref="/search?q=discount"
        />

        {/* 4. Notebooks */}
        <ProductSection
          title="Premium Notebooks"
          products={notebooks}
          viewAllHref="/category/notebooks"
        />

        {/* 5. Pens */}
        <ProductSection
          title="Writing Essentials"
          products={writingEssentials}
          viewAllHref="/category/writing"
        />

        {/* 6. Arts */}
        <ProductSection
          title="Art Supplies"
          products={artSupplies}
          viewAllHref="/category/art"
        />

        {/* 7. Combo */}
        <ProductSection
          title="Value Combos"
          products={combos}
          viewAllHref="/category/combo"
        />
      </main>
      <Footer />
      <FloatingCartBar />
    </div>
  );
};

export default Index;
