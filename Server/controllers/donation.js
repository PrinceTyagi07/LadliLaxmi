
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
  const { userId, level } = req.body;

  try {
    // Validate input
    if (!userId || !level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
        level: level.toString(),
        receiverId: receiver._id.toString(),
      },
    };

    const order = await razorpayinstance.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
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
    const { userId, level, receiverId } = order.notes;

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
      level,
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
        donationLevel: level,
        fromUser: donor._id,
        referenceId: donation._id,
        transactionId: donation.transactionId,
        description: `Donation from ${donor.name} (Level ${level}) via Razorpay`,
        processedAt: new Date(),
      });

      // Add transaction record for donor (without affecting balance)
      donor.walletTransactions.push({
        amount: -amount,
        type: "donation_sent",
        status: "completed",
        donationLevel: level,
        referenceId: donation._id,
        transactionId,
        description: `Donation to ${receiver.name} (Level ${level}) via Razorpay`,
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

// Get summary statistics
router.get("/admin/stats", async (req, res) => {
  try {
    // Verify admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Get all time stats
    const [
      totalDonations,
      pendingDonations,
      completedDonations,
      totalAmount,
      usersCount,
    ] = await Promise.all([
      Donation.countDocuments(),
      Donation.countDocuments({ status: "pending" }),
      Donation.countDocuments({ status: "approved" }),
      Donation.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.countDocuments(),
    ]);

    // Get today's stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayDonations, todayAmount] = await Promise.all([
      Donation.countDocuments({ createdAt: { $gte: todayStart } }),
      Donation.aggregate([
        {
          $match: {
            status: "approved",
            approvedAt: { $gte: todayStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Get recent donations
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("donor", "name email")
      .populate("receiver", "name email")
      .lean();

    res.json({
      success: true,
      stats: {
        totals: {
          donations: totalDonations,
          pending: pendingDonations,
          completed: completedDonations,
          amount: totalAmount[0]?.total || 0,
          users: usersCount,
        },
        today: {
          donations: todayDonations,
          amount: todayAmount[0]?.total || 0,
        },
        recentDonations,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get admin statistics",
      error: err.message,
    });
  }
});

// Get donations with filtering and pagination
router.get("/admin/donations", async (req, res) => {
  try {
    // Verify admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Parse query params
    const {
      status,
      level,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (level) filter.level = level;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get paginated donations
    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("donor", "name email referralCode")
        .populate("receiver", "name email referralCode")
        .lean(),
      Donation.countDocuments(filter),
    ]);

    res.json({
      success: true,
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Admin donations error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get donations",
      error: err.message,
    });
  }
});

// Get user donation history
router.get("/admin/user/:userId/donations", async (req, res) => {
  try {
    // Verify admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { userId } = req.params;
    const { type = "all", limit = 20 } = req.query;

    // Build filter
    const filter = {};
    if (type === "sent") {
      filter.donor = userId;
    } else if (type === "received") {
      filter.receiver = userId;
    } else {
      $or = [{ donor: userId }, { receiver: userId }];
    }

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate(type === "sent" ? "receiver" : "donor", "name email")
      .lean();

    res.json({
      success: true,
      donations,
    });
  } catch (err) {
    console.error("User donations error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get user donations",
      error: err.message,
    });
  }
});

// Get financial summary
router.get("/admin/financial-summary", async (req, res) => {
  try {
    // Verify admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setMonth(now.getMonth() - 1));
    const yearStart = new Date(now.setFullYear(now.getFullYear() - 1));

    // Get all time stats
    const [totalStats, todayStats, weeklyStats, monthlyStats, yearlyStats] =
      await Promise.all([
        Donation.aggregate([
          { $match: { status: "approved" } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
              avgAmount: { $avg: "$amount" },
            },
          },
        ]),
        Donation.aggregate([
          { $match: { status: "approved", approvedAt: { $gte: todayStart } } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),
        Donation.aggregate([
          { $match: { status: "approved", approvedAt: { $gte: weekStart } } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),
        Donation.aggregate([
          { $match: { status: "approved", approvedAt: { $gte: monthStart } } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),
        Donation.aggregate([
          { $match: { status: "approved", approvedAt: { $gte: yearStart } } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    res.json({
      success: true,
      summary: {
        allTime: {
          totalAmount: totalStats[0]?.totalAmount || 0,
          count: totalStats[0]?.count || 0,
          avgAmount: totalStats[0]?.avgAmount || 0,
        },
        today: {
          totalAmount: todayStats[0]?.totalAmount || 0,
          count: todayStats[0]?.count || 0,
        },
        last7Days: {
          totalAmount: weeklyStats[0]?.totalAmount || 0,
          count: weeklyStats[0]?.count || 0,
        },
        last30Days: {
          totalAmount: monthlyStats[0]?.totalAmount || 0,
          count: monthlyStats[0]?.count || 0,
        },
        last365Days: {
          totalAmount: yearlyStats[0]?.totalAmount || 0,
          count: yearlyStats[0]?.count || 0,
        },
      },
    });
  } catch (err) {
    console.error("Financial summary error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get financial summary",
      error: err.message,
    });
  }
});

module.exports = router;
