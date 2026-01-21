import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
      <main>
        <HeroSection />

        {/* 1. Categories */}
        <CategorySection />

        {/* 2. Best Sellers */}
        <ProductSection
          title="Best Sales Products"
          products={bestSellers}
          isBestSeller
        />

        {/* 3. Discounted Products */}
        <ProductSection
          title="Top Discounted Deals"
          subtitle="Grab them before they're gone!"
          products={discountedProducts}
        />

        {/* 4. Notebooks */}
        <ProductSection
          title="Premium Notebooks"
          products={notebooks}
        />

        {/* 5. Pens */}
        <ProductSection
          title="Writing Essentials"
          products={writingEssentials}
        />

        {/* 6. Arts */}
        <ProductSection
          title="Art Supplies"
          products={artSupplies}
        />

        {/* 7. Combo */}
        <ProductSection
          title="Value Combos"
          products={combos}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
