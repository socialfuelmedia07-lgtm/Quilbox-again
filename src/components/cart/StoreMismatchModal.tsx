import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { AlertCircle } from "lucide-react";

const StoreMismatchModal = () => {
    const {
        conflictStoreId,
        setConflictStoreId,
        pendingProduct,
        setPendingProduct,
        clearCart,
        addToCart
    } = useCart();

    const handleClearAndContinue = async () => {
        if (conflictStoreId && pendingProduct) {
            const storeId = conflictStoreId;
            const product = pendingProduct;

            await clearCart();
            await addToCart(product, storeId);
        }
        setConflictStoreId(null);
        setPendingProduct(null);
    };

    const handleCancel = () => {
        setConflictStoreId(null);
        setPendingProduct(null);
    };

    return (
        <Dialog open={!!conflictStoreId} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-6 h-6 text-[#ff3366]" />
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Store Mismatch</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Your cart contains items from another store. Clear your cart to add items from this store?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="rounded-xl font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClearAndContinue}
                        className="bg-[#ff3366] hover:bg-[#ff3366]/90 text-white rounded-xl font-bold px-6 shadow-lg shadow-pink-500/20"
                    >
                        Clear Cart & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StoreMismatchModal;
