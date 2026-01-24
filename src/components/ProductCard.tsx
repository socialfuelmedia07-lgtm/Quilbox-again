import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
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
  const { toast } = useToast();
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

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

  const handleUpdateQuantity = (e: React.MouseEvent, newQty: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, newQty);
  };

  return (
    <>
      <div
        className={cn(
          "group relative block rounded-2xl overflow-hidden cursor-pointer",
          "transition-all duration-300 ease-in-out",
          "bg-white border border-slate-100",
          "dark:bg-slate-900 dark:border-slate-800",
          "hover:scale-[1.01] hover:shadow-lg",
          "animate-fade-in-up"
        )}
        style={{ animationDelay: `${delay}ms` }}
        onClick={() => setOpen(true)}
      >
        {/* Image Container */}
        <div
          className={cn(
            "relative aspect-square p-6 transition-colors duration-300 ease-in-out",
            "bg-slate-50",
            "dark:bg-slate-800/50"
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
          "p-4 transition-colors duration-300 ease-in-out",
          "bg-white dark:bg-slate-900"
        )}>
          {packSize && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {packSize}
            </p>
          )}

          <h3 className={cn(
            "font-bold text-base mb-3 line-clamp-2 transition-colors duration-300",
            "text-slate-900 dark:text-white"
          )}>
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through decoration-1">
                ₹{originalPrice}
              </span>
              <span className={cn(
                "text-lg font-bold transition-colors duration-300",
                "text-slate-900 dark:text-white"
              )}>
                ₹{discountedPrice}
              </span>
            </div>

            {quantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#ff3366] text-white rounded-lg h-8 px-2 shadow-sm">
                <button
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold min-w-[12px] text-center">{quantity}</span>
                <button
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "h-8 px-4 rounded-lg border transition-all duration-300",
                  "bg-white border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366] hover:text-white",
                  "dark:bg-transparent dark:border-[#ff3366] dark:text-[#ff3366] dark:hover:bg-[#ff3366] dark:hover:text-white",
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
            )}
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
