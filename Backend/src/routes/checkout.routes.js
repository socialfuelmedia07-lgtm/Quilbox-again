const express = require('express');
const router = express.Router();
const { previewCheckout, confirmCheckout } = require('../controllers/checkout.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/preview', previewCheckout);
router.post('/confirm', confirmCheckout);

module.exports = router;
