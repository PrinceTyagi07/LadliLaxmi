// const express = require('express');
// const User = require('../models/User');
// const WithdrawRequest = require('../models/WithdrawRequest'); // Assuming you store withdrawals

// // router.post('/request', async (req, res) => {
// exports.WithdrawRequest=async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you're using auth middleware
//     const { amount, bankDetails } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Invalid amount' });
//     }

//     const user = await User.findById(userId);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Save bank details only if not already present
//     if (!user.bankDetails && bankDetails) {
//       user.bankDetails = bankDetails;
//       await user.save();
//     }

//     // Create withdraw request
//     const withdrawRequest = new WithdrawRequest({
//       user: userId,
//       amount,
//       status: 'pending',
//       createdAt: new Date(),
//     });

//     await withdrawRequest.save();

//     return res.status(200).json({ message: 'Withdraw request submitted' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };
const User = require('../models/User');
const WithdrawRequest = require('../models/WithdrawRequest');

exports.WithdrawRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, bankDetails } = req.body;
    console.log(req.body)

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save bank details only if not already present
    if (!user.bankDetails && bankDetails) {
      user.bankDetails = bankDetails;
      await user.save();
    }

    // Optional: Prevent multiple pending requests
    const existing = await WithdrawRequest.findOne({ user: userId, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'A withdrawal request is already pending.' });
    }

    const withdrawRequest = new WithdrawRequest({
      user: userId,
      amount,
      status: 'pending',
      createdAt: new Date(),
    });

    await withdrawRequest.save();

    return res.status(200).json({ message: 'Withdraw request submitted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Admin: Approve or Reject Withdrawal
exports.updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params; // withdraw request ID
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await WithdrawRequest.findById(id).populate("user");
    if (!request) return res.status(404).json({ message: "Withdraw request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is already processed" });
    }

    if (status === "approved") {
      // Check if user has enough balance
      if (request.user.walletBalance < request.amount) {
        return res.status(400).json({ message: "Insufficient user balance" });
      }

      // Deduct balance
      request.user.walletBalance -= request.amount;
      await request.user.save();
    }

    request.status = status;
    await request.save();

    return res.status(200).json({ message: `Withdrawal ${status} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



