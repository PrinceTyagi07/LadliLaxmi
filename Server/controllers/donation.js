
const express = require("express");
const Donation = require("../models/Donation");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const { razorpayinstance } = require("../config/razorpay");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto"); // Added for signature verification

// Create Razorpay Order API
// router.post("/create-order", async (req, res) => {
exports.capturePayment = async (req, res) => {
  const { userId, currentLevel } = req.body;

  try {
    // Validate input
    console.log(userId +" -- " +currentLevel)
    // if (!userId || !currentLevel) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    const donor = await User.findById(userId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const receiver = await User.findOne({ referralCode: donor.referredBy });
    if (!receiver) {
      return res.status(404).json({ message: "Upline not found" });
    }

    // Create Razorpay order
    const amount = 300 * 100; // 300 rupees in paise
    const options = {
      amount: amount.toString(),
      currency: "INR",
      receipt: uuidv4(),
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId.toString(),
        currentLevel: currentLevel.toString(),
        receiverId: receiver._id.toString(),
      },
    };

    const order = await razorpayinstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};

// Razorpay Webhook Handler (for payment verification)
// router.post("/verify-payment", async (req, res) => {
exports.verifyPayment =  async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Payment Failed - Missing parameters" });
  }

  try {
    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Get order details from Razorpay
    const order = await razorpayinstance.orders.fetch(razorpay_order_id);
    const { userId, currentLevel, receiverId } = order.notes;

    const donor = await User.findById(userId).select(
      "+walletBalance +walletTransactions"
    );
    const receiver = await User.findById(receiverId).select(
      "+walletBalance +walletTransactions"
    );

    if (!donor || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize wallets if not already activated
    if (donor.walletBalance === undefined) donor.walletBalance = 0;
    if (receiver.walletBalance === undefined) receiver.walletBalance = 0;

    const amount = order.amount / 100; // Convert back to rupees
    const transactionId = uuidv4();

    // Create donation record
    const donation = new Donation({
      donor: donor._id,
      receiver: receiver._id,
      amount,
      currentLevel,
      status: "completed",
      transactionId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    // Save all changes in a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await donation.save({ session });

      // Update receiver's wallet (donor's wallet remains unchanged as payment was external)
      receiver.walletBalance += amount;
      receiver.walletTransactions.push({
        amount: amount,
        type: "donation_received",
        status: "completed",
        donationLevel: currentLevel,
        fromUser: donor._id,
        referenceId: donation._id,
        transactionId: donation.transactionId,
        description: `Donation from ${donor.name} (Level ${currentLevel}) via Razorpay`,
        processedAt: new Date(),
      });

      // Add transaction record for donor (without affecting balance)
      donor.walletTransactions.push({
        amount: -amount,
        type: "donation_sent",
        status: "completed",
        donationLevel: currentLevel,
        referenceId: donation._id,
        transactionId,
        description: `Donation to ${receiver.name} (currentLevel ${currentLevel}) via Razorpay`,
        processedAt: new Date(),
      });

      // Update user donation references
      donor.donationsSent.push(donation._id);
      receiver.donationsReceived.push(donation._id);

      await donor.save({ session });
      await receiver.save({ session });
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Payment verified and processed successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: err.message,
    });
  }
};
// Additional endpoints could be added here for:
// - Rejecting donations
// - Getting donation history
// - Admin dashboard stats
// ADMIN DASHBOARD STATISTICS ENDPOINTS
