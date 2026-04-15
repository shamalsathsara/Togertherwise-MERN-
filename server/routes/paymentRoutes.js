const express = require("express");
const router = express.Router();
const {
  createStripePaymentIntent,
  createPayPalOrder,
  capturePayPalOrder,
  recordManualDonation,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// POST /api/payment/stripe/create-intent — Create Stripe PaymentIntent
router.post("/stripe/create-intent", createStripePaymentIntent);

// POST /api/payment/paypal/create-order — Create PayPal Order
router.post("/paypal/create-order", createPayPalOrder);

// POST /api/payment/paypal/capture-order — Capture approved PayPal Order
router.post("/paypal/capture-order", capturePayPalOrder);

// POST /api/payment/manual — Record a manual/offline donation (admin only)
// NOTE: This endpoint marks donations as 'completed' and updates project funds.
//       It MUST be restricted to authenticated admins.
router.post("/manual", protect, adminOnly, recordManualDonation);

module.exports = router;
