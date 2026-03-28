/**
 * donationController.js — Donation Recording Controller
 * Handles logging donations and fetching donation statistics.
 * Payment processing is handled by paymentController.js.
 */

const asyncHandler = require("express-async-handler");
const Donation = require("../models/Donation");
const Project = require("../models/Project");

// ─── POST /api/donations ──────────────────────────────────────────────────────
/**
 * createDonation — Records a completed donation in the database.
 * Called after payment is confirmed (by Stripe webhook or PayPal capture).
 */
const createDonation = asyncHandler(async (req, res) => {
  const {
    amount,
    donorName,
    donorEmail,
    donorPhone,
    projectId,
    frequency,
    paymentMethod,
    transactionId,
    message,
    isAnonymous,
  } = req.body;

  if (!amount || !donorName || !donorEmail) {
    res.status(400);
    throw new Error("Amount, donor name, and email are required");
  }

  // Create the donation record
  const donation = await Donation.create({
    amount: Number(amount),
    donorName: isAnonymous ? "Anonymous" : donorName,
    donorEmail,
    donorPhone: donorPhone || "",
    projectId: projectId || null,
    frequency: frequency || "one-time",
    paymentMethod: paymentMethod || "pending",
    transactionId: transactionId || "",
    paymentStatus: transactionId ? "completed" : "pending",
    message: message || "",
    isAnonymous: isAnonymous || false,
  });

  // If donation is linked to a project, update project's currentFunds
  if (projectId && donation.paymentStatus === "completed") {
    await Project.findByIdAndUpdate(projectId, {
      $inc: { currentFunds: Number(amount) },
    });
  }

  res.status(201).json({ success: true, donation });
});

// ─── GET /api/donations ───────────────────────────────────────────────────────
/**
 * getAllDonations — Returns all donations (admin only).
 * Supports pagination via ?page=1&limit=20
 */
const getAllDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const donations = await Donation.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("projectId", "title");

  const total = await Donation.countDocuments();

  res.json({
    success: true,
    count: donations.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    donations,
  });
});

// ─── GET /api/donations/stats ─────────────────────────────────────────────────
/**
 * getDonationStats — Returns aggregated donation data for the transparency page.
 */
const getDonationStats = asyncHandler(async (req, res) => {
  // Total donations amount
  const totalResult = await Donation.aggregate([
    { $match: { paymentStatus: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalAmount = totalResult[0]?.total || 0;

  // Count by frequency
  const oneTimeCount = await Donation.countDocuments({
    frequency: "one-time",
    paymentStatus: "completed",
  });
  const monthlyCount = await Donation.countDocuments({
    frequency: "monthly",
    paymentStatus: "completed",
  });

  // Get allocation by project category based on current funds
  const allocationResult = await Project.aggregate([
    { $group: { _id: "$category", amount: { $sum: "$currentFunds" } } },
    { $sort: { amount: -1 } } // Sort largest to smallest
  ]);

  res.json({
    success: true,
    stats: {
      totalAmount,
      oneTimeCount,
      monthlyCount,
      totalCount: oneTimeCount + monthlyCount,
      allocation: allocationResult,
    },
  });
});

// ─── DELETE /api/donations/:id ────────────────────────────────────────────────
/**
 * deleteDonation — Removes a donation from the database (admin only).
 */
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  // If the donation was linked to a project and completed, deduct the funds from the project (optional depending on business logic, but good practice for data integrity)
  if (donation.projectId && donation.paymentStatus === "completed") {
    await Project.findByIdAndUpdate(donation.projectId, {
      $inc: { currentFunds: -Number(donation.amount) },
    });
  }

  await donation.deleteOne();
  res.json({ success: true, message: "Donation removed successfully" });
});

module.exports = { createDonation, getAllDonations, getDonationStats, deleteDonation };
