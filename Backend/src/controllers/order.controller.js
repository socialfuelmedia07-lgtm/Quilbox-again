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

// @desc    Get order by ID
// @route   GET /orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Check if order belongs to user
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /orders/:id/status
// @access  Private (Simulated Admin)
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!['packed', 'on_the_way'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status update' });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Refund order
// @route   POST /orders/:id/refund
// @access  Private
const refundOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'on_the_way') {
            return res.status(400).json({ message: 'Refund only available when order is on the way' });
        }

        // Increase product stock back
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        // Update status to refunded
        order.status = 'refunded';
        await order.save();

        res.status(200).json({ message: 'Order refunded successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    refundOrder,
};
