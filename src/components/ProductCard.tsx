import { useState } from "react";
import { Heart, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  packSize?: string;
  discount?: number;
  delay?: number;
}

const ProductCard = ({
  id,
  name,
  image,
  originalPrice,
  discountedPrice,
  packSize,
  discount,
  delay = 0,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
    }, 300);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      description: isWishlisted
        ? `${name} has been removed from your wishlist.`
        : `${name} has been saved to your wishlist.`,
    });
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl border border-border overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/10",
        "hover:-translate-y-2 animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="discount-badge shadow-md">
            {discount}% OFF
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center",
          "transition-all duration-300 shadow-md",
          isWishlisted
            ? "bg-primary text-primary-foreground"
            : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square p-6 bg-secondary/30">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick View Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-foreground/5 backdrop-blur-[2px] flex items-center justify-center",
            "opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        >
          <Button variant="glass" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Pack Badge */}
        {packSize && (
          <span className="pack-badge mb-2 inline-block">
            {packSize}
          </span>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-foreground">
            ₹{discountedPrice}
          </span>
          {originalPrice !== discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="add"
          className={cn(
            "w-full gap-2 transition-all duration-300",
            isAdding && "scale-95"
          )}
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
