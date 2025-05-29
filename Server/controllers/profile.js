// ===== controllers/profile.js =====
const User = require("../models/User");

// Recursive function to gather all matrix descendants
const fetchMatrixDescendants = async (userId, visited = new Set()) => {
  if (visited.has(userId.toString())) return [];

  visited.add(userId.toString());

  const user = await User.findById(userId)
    .populate("matrixChildren", "name email referralCode currentLevel referredBy")
    .lean();

  const descendants = [];

  for (const child of user?.matrixChildren || []) {
    if (!descendants.find(u => u._id.toString() === child._id.toString())) {
      descendants.push(child);
    }
    const childDescendants = await fetchMatrixDescendants(child._id, visited);
    descendants.push(...childDescendants.filter(
      u => !descendants.find(d => d._id.toString() === u._id.toString())
    ));
  }

  return descendants;
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate("directReferrals", "name email")
      .populate("matrixChildren", "name email referralCode currentLevel referredBy ")
      .populate("donationsSent")
      .populate("donationsReceived")
      .populate("walletTransactions")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found." });

    const matrixDescendants = await fetchMatrixDescendants(user._id);

    const profile = {
      Id: user._id,
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
      matrixChildren: matrixDescendants,
      bankDetails: user.bankDetails,
      createdAt: user.createdAt,
    };

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error." });
  }
};


