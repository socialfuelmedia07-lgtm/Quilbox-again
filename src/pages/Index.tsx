import Header from "../components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import {
  bestSellers,
  discountedProducts,
  notebooks,
  writingEssentials,
  artSupplies,
  combos
} from "@/data/products";

const Index = () => {
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
