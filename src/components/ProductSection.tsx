import { ChevronRight } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  packSize?: string;
  discount?: number;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showViewAll?: boolean;
  viewAllHref?: string;
  isBestSeller?: boolean;
  limit?: number;
  storeId?: string;
}

const ProductSection = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  viewAllHref = "/search",
  isBestSeller = false,
  limit,
  storeId,
}: ProductSectionProps) => {
  const navigate = useNavigate();

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h2>
              {isBestSeller && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                  Best Sellers
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-muted-foreground text-xs md:text-sm mt-1 font-medium">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Button
              variant="ghost"
              size="sm"
              className="group gap-1 text-[#ff3366] hover:text-[#ff3366] hover:bg-transparent p-0 h-auto font-bold text-sm"
              onClick={() => navigate(viewAllHref)}
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Product List - SINGLE ROW ONLY */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 scrollbar-none gap-4 md:gap-6 snap-x snap-mandatory scroll-smooth p-1">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start"
              >
                <ProductCard
                  {...product}
                  delay={index * 50}
                  storeId={storeId}
                />
              </div>
            ))}

            {showViewAll && products.length > (limit || 0) && (
              <div
                onClick={() => navigate(viewAllHref)}
                className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-6 h-6 text-[#ff3366]" />
                </div>
                <span className="font-bold text-sm text-[#ff3366]">View All</span>
                <span className="text-[10px] text-slate-400 font-medium">+{products.length - (limit || products.length)} more items</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
