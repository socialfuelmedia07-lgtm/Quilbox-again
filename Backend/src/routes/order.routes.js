const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    refundOrder
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/refund', refundOrder);

module.exports = router;
