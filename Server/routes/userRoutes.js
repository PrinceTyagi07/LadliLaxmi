const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');
const LEVELS_CONFIG = require('../config/levels');

// Helper function to find the upline recipient for a specific level's donation/upgrade
// This is the core logic for the multi-level system.
async function findUplineRecipient(userId, targetLevel) {
    let currentUser = await User.findById(userId);
    if (!currentUser) return null;

    let path = []; // To store the referrer chain
    while (currentUser.referrerId) {
        currentUser = await User.findById(currentUser.referrerId);
        if (!currentUser) break; // Should not happen if referrerId is valid
        path.unshift(currentUser); // Add to beginning to get ordered upline
    }

    // Now, `path` contains the upline from direct referrer up to the top.
    // We need to find the user in this path who is at or above `targetLevel`
    // and is eligible to receive payments for that level.
    // The video implies a direct hierarchy:
    // Level 1 donation goes to direct referrer.
    // Level 2 donation goes to the person who referred your direct referrer (your Level 2 upline).
    // This assumes a fixed depth for each level's payment.

    if (path.length >= targetLevel) {
        // Example: If targetLevel is 2, we need the 2nd person in the upline path.
        // path[0] is direct referrer (Level 1 upline)
        // path[1] is referrer's referrer (Level 2 upline)
        const recipient = path[targetLevel - 1];

        // Ensure the recipient is at least at the targetLevel themselves to receive payment for it
        if (recipient && recipient.currentLevel >= targetLevel) {
            return recipient;
        }
    }
    return null; // No eligible recipient found in upline
}

// @route   POST /api/users/activate-level1
// @desc    User activates Level 1 by donating to their referrer
// @access  Private (User must be logged in but not yet active)
router.post('/activate-level1', protect, async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.currentLevel >= 1) return res.status(400).json({ message: 'User already active or at a higher level.' });
    if (!user.referrerId) return res.status(400).json({ message: 'You must have a referrer to activate Level 1.' }); // For new users

    const referrer = await User.findById(user.referrerId);
    if (!referrer) return res.status(404).json({ message: 'Referrer not found.' });

    const donationAmount = LEVELS_CONFIG[1].donation_to_referrer;

    try {
        // 1. Create a pending transaction
        const transaction = new Transaction({
            senderId: user._id,
            receiverId: referrer._id,
            amount: donationAmount,
            level: 1,
            type: 'level_donation',
            status: 'pending', // Awaiting manual verification or payment gateway webhook
            notes: `Level 1 activation donation from ${user.username}`
        });
        await transaction.save();

        res.status(200).json({
            message: `Donation of ₹${donationAmount} requested for Level 1 activation to your referrer. Please complete the payment and wait for verification.`,
            transactionId: transaction._id,
            referrerUPI: referrer.upiId // Assuming UPI ID is stored in User model
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during Level 1 activation.' });
    }
});

// @route   POST /api/users/upgrade-level/:level
// @desc    User upgrades to a new level
// @access  Private (User must be logged in and at previous level)
router.post('/upgrade-level/:targetLevel', protect, async (req, res) => {
    const userId = req.user._id;
    const targetLevel = parseInt(req.params.targetLevel);

    const user = await User.findById(userId).populate('directReferrals'); // Populate direct referrals
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Basic validation
    if (user.currentLevel !== targetLevel - 1) {
        return res.status(400).json({ message: `You must be at Level ${targetLevel - 1} to upgrade to Level ${targetLevel}.` });
    }
    if (!LEVELS_CONFIG[targetLevel]) {
        return res.status(400).json({ message: 'Invalid target level.' });
    }

    const upgradeCost = LEVELS_CONFIG[targetLevel].upgrade_cost;
    const requiredReferrals = LEVELS_CONFIG[targetLevel].required_direct_referrals_for_upgrade;
    const requiredDownlineLevel = LEVELS_CONFIG[targetLevel].required_downline_at_level;

    // Check conditions for upgrade (e.g., direct referrals, downline activity)
    if (requiredReferrals && user.directReferrals.length < requiredReferrals) {
        return res.status(400).json({ message: `You need ${requiredReferrals} direct referrals to upgrade to Level ${targetLevel}.` });
    }

    // Check for downline level requirements (e.g., for Level 2 upgrade, direct referrals should be at Level 1)
    if (requiredDownlineLevel) {
        let countAtRequiredLevel = 0;
        for (let ref of user.directReferrals) {
            if (ref.currentLevel >= requiredDownlineLevel.level) {
                countAtRequiredLevel++;
            }
        }
        if (countAtRequiredLevel < requiredDownlineLevel.count) {
            return res.status(400).json({ message: `At least ${requiredDownlineLevel.count} of your direct referrals must be at Level ${requiredDownlineLevel.level} to upgrade.` });
        }
    }

    // Find the recipient for this upgrade payment
    const upgradeRecipient = await findUplineRecipient(userId, targetLevel);

    if (!upgradeRecipient) {
        return res.status(400).json({ message: 'No eligible upline recipient found for this upgrade. Please contact support.' });
    }

    // Check if user has enough balance for upgrade (assuming funds are in wallet from donations)
    if (user.walletBalance < upgradeCost) {
        return res.status(400).json({ message: `Insufficient balance. You need ₹${upgradeCost} to upgrade.` });
    }

    try {
        // Use a transaction for atomicity if possible (MongoDB replica set required)
        // For simplicity, doing it sequentially here.

        // 1. Deduct upgrade cost from user's wallet
        user.walletBalance -= upgradeCost;
        user.totalDonationsMade += upgradeCost;
        user.currentLevel = targetLevel; // Update user's level
        await user.save();

        // 2. Add upgrade cost to recipient's wallet
        upgradeRecipient.walletBalance += upgradeCost;
        upgradeRecipient.totalDonationsReceived += upgradeCost;
        await upgradeRecipient.save();

        // 3. Record the transaction
        const transaction = new Transaction({
            senderId: user._id,
            receiverId: upgradeRecipient._id,
            amount: upgradeCost,
            level: targetLevel,
            type: 'upgrade_cost',
            status: 'completed', // Assuming instant for automated upgrades
            notes: `Upgrade to Level ${targetLevel}`
        });
        await transaction.save();

        res.status(200).json({ message: `Successfully upgraded to Level ${targetLevel}.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during level upgrade.' });
    }
});

// @route   GET /api/users/my-profile
// @desc    Get logged in user's profile
// @access  Private
router.get('/my-profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('referrerId', 'username email') // Populate referrer's details
            .populate('directReferrals', 'username email currentLevel'); // Populate direct referrals

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/downline/:level
// @desc    Get downline members for a specific level (recursive logic)
// @access  Private
router.get('/downline/:targetLevel', protect, async (req, res) => {
    const userId = req.user._id;
    const targetLevel = parseInt(req.params.targetLevel);

    if (isNaN(targetLevel) || targetLevel < 1) {
        return res.status(400).json({ message: 'Invalid target level.' });
    }

    try {
        // Recursive function to get downline members up to a certain depth
        async function getDownlineRecursive(currentUserId, currentDepth, maxDepth) {
            if (currentDepth > maxDepth) return [];

            const user = await User.findById(currentUserId).populate('directReferrals');
            if (!user || user.directReferrals.length === 0) return [];

            let downline = [];
            for (const directRef of user.directReferrals) {
                // If this is the target level, add the user
                if (currentDepth === maxDepth) {
                    downline.push({
                        _id: directRef._id,
                        username: directRef.username,
                        email: directRef.email,
                        currentLevel: directRef.currentLevel,
                        levelInDownline: currentDepth
                    });
                }
                // Recursively get downline from this direct referral
                const nestedDownline = await getDownlineRecursive(directRef._id, currentDepth + 1, maxDepth);
                downline = downline.concat(nestedDownline);
            }
            return downline;
        }

        const downlineMembers = await getDownlineRecursive(userId, 1, targetLevel);

        res.json({
            level: targetLevel,
            members: downlineMembers
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error getting downline.' });
    }
});


module.exports = router;