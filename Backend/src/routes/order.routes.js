const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);

module.exports = router;
