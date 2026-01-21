import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  packSize?: string;
  discount?: number;
  delay?: number;
  // Fallback for props that might satisfy Product
  category?: string;
  brand?: string;
  rating?: number;
  popularity?: number;
}

const ProductCard = (props: ProductCardProps) => {
  const {
    id,
    name,
    image,
    originalPrice,
    discountedPrice,
    packSize,
    discount,
    delay = 0,
  } = props;

  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    // Disable pulse after initial animation
    const timer = setTimeout(() => setShouldPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking Add to Cart
    e.stopPropagation();

    setIsAdding(true);

    // Construct product object for context
    const productToAdd: Product = {
      id,
      name,
      image,
      originalPrice,
      discountedPrice,
      packSize,
      discount,
      category: (props.category as any) || "Other", // Safe cast or default
      brand: props.brand || "Generic",
      rating: props.rating || 0,
      popularity: props.popularity || 0,
    };

    addToCart(productToAdd);

    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
    }, 300);
  };

  return (
    <>
      <div
        className={cn(
          "group relative block rounded-3xl overflow-hidden cursor-pointer",
          "transition-all duration-700 ease-in-out",
          "bg-white border border-gray-100",
          "dark:bg-[#0f172a] dark:border-gray-800",
          "hover:scale-[1.02] hover:shadow-xl",
          "animate-fade-in-up",
          shouldPulse && "animate-pulse ring-2 ring-primary/20"
        )}
        style={{ animationDelay: `${delay}ms` }}
        onClick={() => setOpen(true)}
      >
        {/* Image Container */}
        <div
          className={cn(
            "relative aspect-square p-8 transition-colors duration-700 ease-in-out",
            "bg-white",
            "dark:bg-[#f3f4f6]"
          )}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Content Area */}
        <div className={cn(
          "p-5 transition-colors duration-700 ease-in-out",
          "bg-white dark:bg-[#0f172a]"
        )}>
          {packSize && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              {packSize}
            </p>
          )}

          <h3 className={cn(
            "font-bold text-base mb-3 line-clamp-2 transition-colors duration-700",
            "text-gray-900 dark:text-white"
          )}>
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through decoration-1">
                ₹{originalPrice}
              </span>
              <span className={cn(
                "text-xl font-bold transition-colors duration-700",
                "text-gray-900 dark:text-white"
              )}>
                ₹{discountedPrice}
              </span>
            </div>

            <Button
              variant="default"
              size="sm"
              className={cn(
                "h-8 px-5 rounded-lg border transition-all duration-300",
                "bg-white border-primary text-primary hover:bg-primary hover:text-white",
                "dark:bg-transparent dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white",
                "font-bold tracking-wide text-xs",
                isAdding && "scale-95 opacity-80"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
            >
              {isAdding ? "ADDED" : "ADD"}
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        product={{
          id,
          name,
          image,
          originalPrice,
          discountedPrice,
          packSize,
          discount,
          category: (props.category as any) || "Other",
          brand: props.brand || "Generic",
          rating: props.rating || 0,
          popularity: props.popularity || 0,
        }}
        open={open}
        onOpenChange={setOpen}
        trigger={null} // Trigger is handled by the parent div click
      />
    </>
  );
};

export default ProductCard;
