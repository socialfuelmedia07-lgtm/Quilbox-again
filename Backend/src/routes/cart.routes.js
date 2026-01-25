const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart); // NEW
router.patch('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);

module.exports = router;
