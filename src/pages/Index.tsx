import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Import product images
import productPens from "@/assets/product-pens.png";
import productNotebooks from "@/assets/product-notebooks.png";
import productArt from "@/assets/product-art.png";
import productSchool from "@/assets/product-school.png";

const bestSellers = [
  {
    id: "1",
    name: "Complete Writing Kit (Budget Pack)",
    image: productPens,
    originalPrice: 70,
    discountedPrice: 60,
    packSize: "9 Pack",
    discount: 14,
  },
  {
    id: "2",
    name: "Notebook Combo Pack",
    image: productNotebooks,
    originalPrice: 270,
    discountedPrice: 240,
    packSize: "3 Pack",
    discount: 11,
  },
  {
    id: "3",
    name: "School Starter Pack",
    image: productSchool,
    originalPrice: 250,
    discountedPrice: 220,
    packSize: "6 Pack",
    discount: 12,
  },
  {
    id: "4",
    name: "Art Essentials Mini Pack",
    image: productArt,
    originalPrice: 350,
    discountedPrice: 300,
    packSize: "3 Pack",
    discount: 14,
  },
];

const writingEssentials = [
  {
    id: "5",
    name: "Fine Gel Pens",
    image: productPens,
    originalPrice: 483,
    discountedPrice: 403,
    packSize: "Single",
    discount: 17,
  },
  {
    id: "6",
    name: "Ballpoint Pens",
    image: productPens,
    originalPrice: 165,
    discountedPrice: 138,
    packSize: "Single",
    discount: 16,
  },
  {
    id: "7",
    name: "Mechanical Pencils",
    image: productPens,
    originalPrice: 232,
    discountedPrice: 194,
    packSize: "Single",
    discount: 16,
  },
  {
    id: "8",
    name: "Highlighters",
    image: productSchool,
    originalPrice: 168,
    discountedPrice: 140,
    packSize: "Single",
    discount: 17,
  },
];

const notebooks = [
  {
    id: "9",
    name: "A4/A5 Notebooks",
    image: productNotebooks,
    originalPrice: 436,
    discountedPrice: 364,
    packSize: "Single",
    discount: 17,
  },
  {
    id: "10",
    name: "Spiral Diaries",
    image: productNotebooks,
    originalPrice: 577,
    discountedPrice: 481,
    packSize: "Single",
    discount: 17,
  },
  {
    id: "11",
    name: "Notepads",
    image: productNotebooks,
    originalPrice: 393,
    discountedPrice: 328,
    packSize: "Single",
    discount: 17,
  },
  {
    id: "12",
    name: "Sketchbooks",
    image: productNotebooks,
    originalPrice: 472,
    discountedPrice: 394,
    packSize: "Single",
    discount: 17,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={3} wishlistCount={2} />
      <main>
        <HeroSection />
        <CategorySection />
        <ProductSection
          title="Best Selling Items"
          products={bestSellers}
          isBestSeller
        />
        <PromoSection />
        <ProductSection
          title="Writing Essentials"
          subtitle="8 items"
          products={writingEssentials}
        />
        <ProductSection
          title="Paper & Notebooks"
          subtitle="8 items"
          products={notebooks}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
