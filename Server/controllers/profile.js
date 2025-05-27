// ===== controllers/profile.js =====
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("directReferrals", "name email")
      .populate("matrixChildren", "name email")
      .populate("donationsSent")
      .populate("donationsReceived")
      .populate("walletTransactions")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found." });

    const profile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      currentLevel: user.currentLevel,
      walletBalance: user.walletBalance,
      totalDonationsSent: user.donationsSent.length,
      totalDonationsReceived: user.donationsReceived.length,
      directReferrals: user.directReferrals,
      matrixChildren: user.matrixChildren,
      bankDetails: user.bankDetails,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

