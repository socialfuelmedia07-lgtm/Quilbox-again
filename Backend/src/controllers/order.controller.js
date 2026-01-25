const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Place order from cart
// @route   POST /orders
// @access  Private
const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate stock and calculate total
        for (const item of cart.items) {
            if (!item.product) {
                return res.status(400).json({ message: `Product no longer exists` });
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
            }

            totalAmount += item.price * item.quantity;
            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
        });

        // Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my orders
// @route   GET /orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
};
