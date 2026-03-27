/**
 * paymentController.js — Payment Gateway Scaffold
 *
 * This controller is designed for FUTURE integration with Stripe and PayPal.
 * It provides the correct structure and detailed comments so that adding live
 * API keys will make it immediately functional.
 *
 * To activate Stripe:
 *   1. Add STRIPE_SECRET_KEY to your .env file
 *   2. Run: npm install stripe
 *   3. Uncomment the Stripe code blocks below
 *
 * To activate PayPal:
 *   1. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env
 *   2. Run: npm install @paypal/checkout-server-sdk
 *   3. Uncomment the PayPal code blocks below
 */

const asyncHandler = require("express-async-handler");
const Donation = require("../models/Donation");

// ─── STRIPE INTEGRATION (Future) ─────────────────────────────────────────────
// Uncomment when STRIPE_SECRET_KEY is available in .env:
//
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/payment/stripe/create-intent ──────────────────────────────────
/**
 * createStripePaymentIntent
 * Creates a Stripe PaymentIntent and returns the client_secret to the frontend.
 * The frontend uses this secret with Stripe.js to confirm the payment.
 *
 * Flow:
 *   Client: POST /api/payment/stripe/create-intent { amount, currency, donorInfo }
 *   Server: Creates PaymentIntent → returns { clientSecret }
 *   Client: stripe.confirmCardPayment(clientSecret, cardElement)
 *   Server: Webhook → confirms payment → updates Donation.paymentStatus
 */
const createStripePaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = "usd", donorName, donorEmail, projectId, frequency } =
    req.body;

  // Validate the donation amount
  if (!amount || amount < 1) {
    res.status(400);
    throw new Error("Invalid donation amount");
  }

  // ── Scaffold response (replace with real Stripe call below) ──────────────
  // LIVE CODE (uncomment when Stripe key is ready):
  //
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(amount * 100), // Stripe uses cents
  //   currency,
  //   metadata: {
  //     donorName,
  //     donorEmail,
  //     projectId: projectId || "general",
  //     frequency,
  //   },
  // });
  //
  // res.json({ clientSecret: paymentIntent.client_secret });

  // ── PLACEHOLDER RESPONSE (remove when Stripe is live) ────────────────────
  res.json({
    success: false,
    message: "Stripe integration pending — add STRIPE_SECRET_KEY to .env",
    scaffold: {
      amount,
      currency,
      donorName,
      donorEmail,
      note: "Uncomment Stripe code in paymentController.js to activate",
    },
  });
});

// ─── POST /api/payment/paypal/create-order ───────────────────────────────────
/**
 * createPayPalOrder
 * Creates a PayPal order and returns the order ID to the frontend.
 * The frontend uses the PayPal JS SDK to capture the payment.
 *
 * Flow:
 *   Client: POST /api/payment/paypal/create-order { amount, donorInfo }
 *   Server: Creates Order → returns { orderId }
 *   Client: paypal.Buttons({ createOrder: () => orderId }).render()
 *   Client: On approval → POST /api/payment/paypal/capture-order { orderId }
 */
const createPayPalOrder = asyncHandler(async (req, res) => {
  const { amount, donorName, donorEmail, projectId, frequency } = req.body;

  // ── PLACEHOLDER RESPONSE ──────────────────────────────────────────────────
  res.json({
    success: false,
    message: "PayPal integration pending — add PAYPAL_CLIENT_ID to .env",
    scaffold: {
      amount,
      donorName,
      donorEmail,
      note: "Uncomment PayPal code in paymentController.js to activate",
    },
  });
});

// ─── POST /api/payment/paypal/capture-order ──────────────────────────────────
/**
 * capturePayPalOrder
 * Captures an approved PayPal order and records the donation in the database.
 */
const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { orderId, donorName, donorEmail, amount, projectId, frequency } = req.body;

  // ── PLACEHOLDER RESPONSE ──────────────────────────────────────────────────
  res.json({
    success: false,
    message: "PayPal capture pending — integration not yet active",
  });
});

// ─── POST /api/payment/manual ────────────────────────────────────────────────
/**
 * recordManualDonation
 * Records a donation directly (e.g., bank transfer, cash) without a payment processor.
 * Can be used by admins to log offline donations.
 */
const recordManualDonation = asyncHandler(async (req, res) => {
  const {
    amount,
    donorName,
    donorEmail,
    donorPhone,
    projectId,
    frequency,
    message,
    isAnonymous,
  } = req.body;

  // Validate required fields
  if (!amount || !donorName || !donorEmail) {
    res.status(400);
    throw new Error("Amount, donor name, and email are required");
  }

  // Create the donation record in the database
  const donation = await Donation.create({
    amount,
    donorName: isAnonymous ? "Anonymous" : donorName,
    donorEmail,
    donorPhone: donorPhone || "",
    projectId: projectId || null,
    frequency: frequency || "one-time",
    paymentMethod: "manual",
    paymentStatus: "completed", // Manual donations are recorded as confirmed
    message: message || "",
    isAnonymous: isAnonymous || false,
  });

  res.status(201).json({
    success: true,
    message: "Donation recorded successfully",
    donation,
  });
});

module.exports = {
  createStripePaymentIntent,
  createPayPalOrder,
  capturePayPalOrder,
  recordManualDonation,
};
