const express = require("express");
const router = express.Router();
const {
  createStripePaymentIntent,
  createPayPalOrder,
  capturePayPalOrder,
  recordManualDonation,
} = require("../controllers/paymentController");

// POST /api/payment/stripe/create-intent — Create Stripe PaymentIntent
router.post("/stripe/create-intent", createStripePaymentIntent);

// POST /api/payment/paypal/create-order — Create PayPal Order
router.post("/paypal/create-order", createPayPalOrder);

// POST /api/payment/paypal/capture-order — Capture approved PayPal Order
router.post("/paypal/capture-order", capturePayPalOrder);

// POST /api/payment/manual — Record a manual/offline donation
router.post("/manual", recordManualDonation);

module.exports = router;
