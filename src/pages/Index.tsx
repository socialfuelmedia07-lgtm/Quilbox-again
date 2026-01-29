import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { productApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts();
        const transformedData = data.map((p: any) => ({
          ...p,
          id: p._id || p.id,
          image: p.imageUrl || p.image // Unify image field as well
        }));
        setProducts(transformedData);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getByCategory = (cat: string) => products.filter(p => p.category === cat).slice(0, 10);

  const bestSellers = [...products]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);

  const discountedDeals = [...products]
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[105px] md:pt-24 container mx-auto px-4 space-y-12">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(j => <Skeleton key={j} className="h-64 rounded-2xl" />)}
              </div>
            </div>
          ))}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[105px] md:pt-0">
        <HeroSection />

        <CategorySection />

        <ProductSection
          title="Best Sales Products"
          products={bestSellers}
          isBestSeller
          viewAllHref="/search?q=best+sellers"
          limit={10}
        />

        <ProductSection
          title="Top Discounted Deals"
          subtitle="Grab them before they're gone!"
          products={discountedDeals}
          viewAllHref="/search?q=discount"
          limit={10}
        />

        <ProductSection
          title="Premium Notebooks"
          products={getByCategory("Notebooks")}
          viewAllHref="/category/notebooks"
          limit={10}
        />

        <ProductSection
          title="Writing Essentials"
          products={getByCategory("Writing")}
          viewAllHref="/category/writing"
          limit={10}
        />

        <ProductSection
          title="Art Supplies"
          products={getByCategory("Art Supplies")}
          viewAllHref="/category/art"
          limit={10}
        />

        <ProductSection
          title="Value Combos"
          products={getByCategory("Combo")}
          viewAllHref="/category/combo"
          limit={10}
        />
      </main>
      <Footer />
      <FloatingCartBar />
    </div>
  );
};

export default Index;
