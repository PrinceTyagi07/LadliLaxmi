const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // ✅ Import UUID
const User = require("../models/User");
const Donation = require("../models/Donation");
const WalletTransaction = require("../models/WalletTransaction");

const LEVEL_FLOW = {
  1: { amount: 300, uplineIncome: 600, upgradeCost: 500, netIncome: 100 },
  2: { amount: 500, uplineIncome: 2000, upgradeCost: 1000, netIncome: 1000 },
  3: { amount: 1000, uplineIncome: 4000, upgradeCost: 2000, netIncome: 2000 },
  4: { amount: 2000, uplineIncome: 8000, upgradeCost: 4000, netIncome: 4000 },
  5: { amount: 4000, uplineIncome: 16000, upgradeCost: 8000, netIncome: 8000 },
  6: { amount: 8000, uplineIncome: 32000, upgradeCost: 16000, netIncome: 16000 },
  7: { amount: 16000, uplineIncome: 64000, upgradeCost: 32000, netIncome: 32000 },
  8: { amount: 32000, uplineIncome: 128000, upgradeCost: 64000, netIncome: 64000 },
  9: { amount: 64000, uplineIncome: 256000, upgradeCost: 128000, netIncome: 128000 },
  10: { amount: 128000, uplineIncome: 512000, upgradeCost: 256000, netIncome: 256000 },
  11: { amount: 256000, uplineIncome: 1024000, upgradeCost: 512000, netIncome: 512000 },
};

exports.initiateUpgrade = async (req, res) => {
  const { userId, level } = req.body;
  console.log("Upgrade Request:", { userId, level });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const flow = LEVEL_FLOW[level];
    if (!flow) return res.status(400).json({ message: "Invalid level" });

    const amount = flow.amount;
    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
        required: amount,
        current: user.walletBalance,
      });
    }

    const upline = await User.findOne({ referralCode: user.referredBy });
    if (!upline) return res.status(404).json({ message: "Upline not found" });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Adjust balances
      user.walletBalance -= amount;
      upline.walletBalance += amount;

      // Create transactions
      const userTxn = new WalletTransaction({
        amount: -amount,
        type: "donation_sent",
        status: "completed",
        donationLevel: level,
        fromUser: user._id,
        toUser: upline._id,
        description: `Upgrade to Level ${level}`,
      });

      const uplineTxn = new WalletTransaction({
        amount: amount,
        type: "donation_received",
        status: "completed",
        donationLevel: level,
        fromUser: user._id,
        toUser: upline._id,
        description: `Received Level ${level} Upgrade Payment`,
      });

      await userTxn.save({ session });
      await uplineTxn.save({ session });

      // Create donation with unique transactionId
      const donation = new Donation({
        donor: user._id,
        receiver: upline._id,
        amount,
        currentLevel: level,
        status: "completed",
        transactionId: uuidv4(), // ✅ Unique ID to avoid duplicate key error
      });

      await donation.save({ session });

      // Update users
      user.walletTransactions.push(userTxn._id);
      user.donationsSent.push(donation._id);
      user.currentLevel = level;

      upline.walletTransactions.push(uplineTxn._id);
      upline.donationsReceived.push(donation._id);

      await user.save({ session });
      await upline.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: `Upgrade to Level ${level} successful`,
        newBalance: user.walletBalance,
        level: user.currentLevel,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction error:", err);
      return res.status(500).json({ message: "Transaction failed", error: err.message });
    }
  } catch (err) {
    console.error("Upgrade failed:", err);
    return res.status(500).json({ message: "Upgrade failed", error: err.message });
  }
};
