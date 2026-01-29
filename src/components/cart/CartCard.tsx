import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types/cart";

interface CartCardProps {
    item: CartItem;
}

const CartCard = ({ item }: CartCardProps) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex gap-4 p-4 border rounded-xl bg-card hover:shadow-sm transition-shadow">
            {/* Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                    {item.packSize && (
                        <p className="text-xs text-muted-foreground mt-1">{item.packSize}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-primary">₹{item.discountedPrice}</div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md">
                            <button
                                className="p-1 hover:bg-secondary rounded-l-md transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                                className="p-1 hover:bg-secondary rounded-r-md transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartCard;
