const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/transactions/my
// @desc    Get logged in user's transactions
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
        }).sort({ createdAt: -1 }); // Latest first

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching transactions.' });
    }
});

module.exports = router;