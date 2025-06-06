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
// const mongoose = require('mongoose');
// const User = require('../models/User');
// const Donation = require('../models/Donation');
// const WalletTransaction = require('../models/WalletTransaction');

// exports.initiateUpgrade = async (req, res) => {
//   const { userId, level, amount } = req.body;
//   console.log("Upgrade Request:", { userId, level, amount });

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the user is already at or above the target level
//     if (user.currentLevel >= level) {
//       return res.status(400).json({ message: `User is already at Level ${level} or higher.` });
//     }

//     if (user.walletBalance < amount) {
//       return res.status(400).json({
//         message: "Insufficient balance for upgrade",
//         required: amount,
//         current: user.walletBalance,
//       });
//     }

//     // Step 1: Find the direct upline (sponsor/parent)
//     const directUpline = await User.findOne({ referralCode: user.referredBy });
//     if (!directUpline) {
//       // If there's no direct upline, the upgrade chain is broken at the first step.
//       // This user might be a top-level user created manually without a referrer.
//       // You must decide where funds go in this specific case (e.g., to a system admin wallet, or prevent upgrade).
//       return res.status(404).json({ message: "Direct upline (sponsor) not found. Cannot complete upgrade." });
//     }

//     // Step 2: Attempt to find the grand upline (upline of the direct upline)
//     let grandUpline = null;
//     if (directUpline.referredBy) { // Only try to find grandUpline if directUpline has a referrer
//       grandUpline = await User.findOne({ referralCode: directUpline.referredBy });
//     }

//     // Step 3: Determine the final receiver for the upgrade amount
//     // If grandUpline is not found, send amount to directUpline (parent)
//     const receiverForUpgrade = grandUpline || directUpline;

//     // Log the determined receiver (for debugging)
//     console.log(`Upgrade amount for user ${user.name || user._id} (Level ${level}, Amount ${amount}) will go to: ${receiverForUpgrade.name || receiverForUpgrade._id}`);


//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Create user wallet transaction (deduction)
//       const userTxn = new WalletTransaction({
//         amount: -amount,
//         type: "donation_sent",
//         status: "completed",
//         donationLevel: level,
//         fromUser: user._id,
//         toUser: receiverForUpgrade._id,
//         description: `Upgrade to Level ${level}`,
//       });

//       // Create receiver wallet transaction (addition)
//       const receiverTxn = new WalletTransaction({
//         amount: amount,
//         type: "donation_received",
//         status: "completed",
//         donationLevel: level,
//         fromUser: user._id,
//         toUser: receiverForUpgrade._id,
//         description: `Received Upgrade Payment for Level ${level} from ${user.name || 'a user'}`,
//       });

//       await userTxn.save({ session });
//       await receiverTxn.save({ session });

//       // Create Donation record
//       const donation = new Donation({
//         donor: user._id,
//         receiver: receiverForUpgrade._id,
//         amount,
//         currentLevel: level,
//         status: "completed",
//       });
//       await donation.save({ session });

//       // Apply all updates to user and receiver
//       user.walletBalance -= amount;
//       user.walletTransactions.push(userTxn._id);
//       user.donationsSent.push(donation._id);
//       user.currentLevel = level; // Update user's level

//       receiverForUpgrade.walletBalance += amount;
//       receiverForUpgrade.walletTransactions.push(receiverTxn._id);
//       receiverForUpgrade.donationsReceived.push(donation._id);

//       await user.save({ session });
//       await receiverForUpgrade.save({ session }); // Save the chosen receiver's updated data

//       await session.commitTransaction();
//       session.endSession();

//       return res.json({
//         success: true,
//         message: "Upgrade successful",
//         newBalance: user.walletBalance,
//         level: user.currentLevel,
//       });

//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Transaction error during upgrade:", err);
//       return res.status(500).json({ message: "Transaction failed", error: err.message });
//     }

//   } catch (err) {
//     console.error("Initiate upgrade failed:", err);
//     return res.status(500).json({ message: "Upgrade initiation failed", error: err.message });
//   }
// };