const Store = require('../models/Store');
const StoreInventory = require('../models/StoreInventory');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const evaluateStores = async (items, userLocation) => {
    const stores = await Store.find({ isActive: true });
    const eligibleStores = [];

    for (const store of stores) {
        let allItemsAvailable = true;
        const storeId = store._id;

        for (const item of items) {
            const inventory = await StoreInventory.findOne({
                store: storeId,
                product: item.product
            });

            if (!inventory || inventory.quantity < item.quantity) {
                allItemsAvailable = false;
                break;
            }
        }

        if (allItemsAvailable) {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                store.location.lat,
                store.location.lng
            );
            eligibleStores.push({ store, distance });
        }
    }

    if (eligibleStores.length === 0) return null;

    // Sort by distance and return the nearest
    eligibleStores.sort((a, b) => a.distance - b.distance);
    return eligibleStores[0];
};

// @desc    Preview checkout
// @route   POST /checkout/preview
// @access  Private
const previewCheckout = async (req, res) => {
    const { items, userLocation } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    if (!userLocation || !userLocation.lat || !userLocation.lng) {
        return res.status(400).json({ message: "User location required" });
    }

    try {
        const bestStoreSelection = await evaluateStores(items, userLocation);

        if (!bestStoreSelection) {
            return res.status(404).json({ message: "No nearby store has enough stock for your order" });
        }

        const { store, distance } = bestStoreSelection;

        // Calculate total
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            total += (product ? product.price : 0) * item.quantity;
        }

        // Mock ETA: 10 mins base + 5 mins per km
        const eta = Math.round(10 + (distance * 5));

        res.status(200).json({
            store: {
                id: store._id,
                name: store.name,
                location: store.location,
                distance: parseFloat(distance.toFixed(2))
            },
            items,
            total,
            eta: `${eta} mins`,
            status: "ready_for_payment"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirm checkout
// @route   POST /checkout/confirm
// @access  Private
const confirmCheckout = async (req, res) => {
    const { items, userLocation, shippingAddress } = req.body;

    try {
        const bestStoreSelection = await evaluateStores(items, userLocation);

        if (!bestStoreSelection) {
            return res.status(404).json({ message: "Stock no longer available in nearby stores" });
        }

        const { store } = bestStoreSelection;

        // Deduct stock and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            const price = product.price;
            totalAmount += price * item.quantity;

            // Deduct from inventory
            await StoreInventory.findOneAndUpdate(
                { store: store._id, product: item.product },
                { $inc: { quantity: -item.quantity } }
            );

            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                price: price
            });
        }

        // Create Order
        const order = await Order.create({
            user: req.user.id,
            store: store._id,
            items: orderItems,
            totalAmount,
            status: 'order_placed',
            shippingAddress: shippingAddress || "Address not provided"
        });

        // Clear Cart
        await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], store: null });

        // Persist User Address (as requested)
        if (shippingAddress) {
            await User.findByIdAndUpdate(req.user.id, {
                savedAddress: shippingAddress,
                savedLocation: userLocation
            });
        }

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    previewCheckout,
    confirmCheckout
};
