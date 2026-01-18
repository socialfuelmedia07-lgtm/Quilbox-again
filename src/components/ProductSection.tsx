import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  isBestSeller?: boolean;
}

const ProductSection = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  isBestSeller = false,
}: ProductSectionProps) => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {title}
              </h2>
              {isBestSeller && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  Best Sellers
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Button variant="ghost" className="group gap-2 self-start sm:self-auto">
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
