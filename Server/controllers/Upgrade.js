const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const WalletTransaction = require('../models/WalletTransaction');

exports.initiateUpgrade = async (req, res) => {
  const { userId, level, amount } = req.body;
  console.log("Upgrade Request:", { userId, level, amount });

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
        required: amount,
        current: user.walletBalance,
      });
    }

    const upline = await User.findOne({ referralCode: user.referredBy });
    if (!upline) {
      return res.status(404).json({ message: "Upline not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user wallet transaction
      const userTxn = new WalletTransaction({
        amount: -amount,
        type: "donation_sent",
        status: "completed",
        donationLevel: level,
        fromUser: user._id,
        toUser: upline._id,
        description: `Upgrade to Level ${level}`,
      });

      // Create upline wallet transaction
      const uplineTxn = new WalletTransaction({
        amount: amount,
        type: "donation_received",
        status: "completed",
        donationLevel: level,
        fromUser: user._id,
        toUser: upline._id,
        description: `Received Upgrade Payment for Level ${level}`,
      });

      await userTxn.save({ session });
      await uplineTxn.save({ session });

      // Create Donation record
      const donation = new Donation({
        donor: user._id,
        receiver: upline._id,
        amount,
        currentLevel: level,
        status: "completed",
      });
      await donation.save({ session });

      // Apply all updates
      user.walletBalance -= amount;
      user.walletTransactions.push(userTxn._id);
      user.donationsSent.push(donation._id);

      upline.walletBalance += amount;
      upline.walletTransactions.push(uplineTxn._id);
      upline.donationsReceived.push(donation._id);

      // Update user current level (optional or admin-approved later)
      user.currentLevel = level;

      await user.save({ session });
      await upline.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Upgrade successful",
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
