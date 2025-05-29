const express = require('express');
const User = require('../models/User');
const WithdrawRequest = require('../models/WithdrawRequest'); // Assuming you store withdrawals

// router.post('/request', async (req, res) => {
exports.WithdrawRequest=async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using auth middleware
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save bank details only if not already present
    if (!user.bankDetails && bankDetails) {
      user.bankDetails = bankDetails;
      await user.save();
    }

    // Create withdraw request
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

