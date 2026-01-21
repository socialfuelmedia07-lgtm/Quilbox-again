import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CartCard from "./CartCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const ViewCart = () => {
    const { cart, isCartOpen, toggleCart, cartTotal } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={toggleCart}>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart ({cart.length})
                    </SheetTitle>
                </SheetHeader>

                {cart.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <CartCard key={item.id} item={item} />
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t pt-4 space-y-4">
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <Button className="w-full" size="lg">
                                Checkout Now
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Shipping & taxes calculated at checkout
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium mb-2">Your cart is empty</p>
                        <p className="text-sm">Looks like you haven't added anything yet.</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => toggleCart(false)}
                        >
                            Start Shopping
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default ViewCart;
