const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, completeProfile } = require('../controllers/auth.controller');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-profile', completeProfile);

module.exports = router;
