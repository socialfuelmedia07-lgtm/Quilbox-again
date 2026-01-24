import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  viewAllHref?: string;
  isBestSeller?: boolean;
}

const ProductSection = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  viewAllHref = "/search",
  isBestSeller = false,
}: ProductSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="py-1 bg-background">
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
            <Button
              variant="ghost"
              className="group gap-2 self-start sm:self-auto"
              onClick={() => navigate(viewAllHref)}
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
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
