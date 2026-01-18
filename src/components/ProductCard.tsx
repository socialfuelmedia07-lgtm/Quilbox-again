import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount?: number;
  delay?: number;
}

const ProductCard = ({
  id,
  name,
  image,
  originalPrice,
  discountedPrice,
  discount,
  delay = 0,
}: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: name,
    });
  };

  return (
    <div
      className={cn(
        "group bg-background border border-border overflow-hidden",
        "transition-all duration-200 hover:border-primary/30"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary/50">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="discount-badge">
              -{discount}%
            </span>
          </div>
        )}

        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-foreground">
            ₹{discountedPrice}
          </span>
          {originalPrice !== discountedPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="add"
          className="w-full h-10"
          onClick={handleAddToCart}
        >
          <Plus className="w-4 h-4" />
          ADD
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
