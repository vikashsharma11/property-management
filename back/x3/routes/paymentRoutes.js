const express = require('express');
const { createPaymentIntent, capturePayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-payment-intent', verifyToken, createPaymentIntent);
router.post('/capture-payment', verifyToken, capturePayment);

module.exports = router;
