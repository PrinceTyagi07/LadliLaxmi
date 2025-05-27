// controllers/upgradeController.js
const User = require('../models/User');
const Donation = require('../models/Donation');

exports.initiateUpgrade = async (req, res) => {
  const { userId, level, amount } = req.body;
  
  try {
    // 1. Verify user exists and has sufficient balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.walletBalance < amount) {
      return res.status(400).json({ 
        message: "Insufficient balance",
        required: amount,
        current: user.walletBalance
      });
    }

    // 2. Find upline user
    const upline = await User.findOne({ referralCode: user.referredBy });
    if (!upline) {
      return res.status(404).json({ message: "Upline not found" });
    }

    // 3. Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 4. Deduct from user's wallet
      user.walletBalance -= amount;
      user.walletTransactions.push({
        amount: -amount,
        type: "upgrade_payment",
        status: "pending",
        level: level,
        description: `Upgrade to Level ${level}`
      });
      
      // 5. Create pending donation record
      const donation = new Donation({
        donor: user._id,
        receiver: upline._id,
        amount,
        level,
        type: "upgrade",
        status: "pending"
      });
      
      // 6. Save all changes
      await donation.save({ session });
      user.donationsSent.push(donation._id);
      upline.donationsReceived.push(donation._id);
      
      await user.save({ session });
      await upline.save({ session });
      
      // 7. Update user level (but keep it pending until admin approval)
      user.pendingLevel = level;
      await user.save({ session });
      
      await session.commitTransaction();
      
      res.json({
        success: true,
        message: "Upgrade initiated. Waiting for admin approval.",
        newBalance: user.walletBalance,
        pendingLevel: level
      });
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upgrade failed",
      error: error.message
    });
  }
};