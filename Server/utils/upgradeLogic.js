const User = require("../models/User");
const Donation = require("../models/Donation");
const levels = require("./levels");

const checkAndUpgradeLevel = async (userId) => {
  const user = await User.findById(userId).populate("donationsReceived");
  if (!user) throw new Error("User not found");

  const currentLevel = user.level;
  const nextLevel = currentLevel + 1;
  const currentLevelConfig = levels[currentLevel];

  if (!currentLevelConfig || currentLevelConfig.upgrade === 0) {
    return { upgraded: false, message: "Final level reached" };
  }

  // Filter only approved donations of current level
  const approvedDonations = user.donationsReceived.filter(
    (d) => d.level === currentLevel && d.status === "approved"
  );

  const totalReceived = approvedDonations.reduce((sum, d) => sum + d.amount, 0);

  if (totalReceived >= currentLevelConfig.upgrade) {
    // Upgrade user
    user.level = nextLevel;
    await user.save();
    // Send upgrade help to their upline
    const upline = await User.findOne({ referralCode: user.referredBy });
    if (upline) {
      const upgradeDonation = new Donation({
        donor: user._id,
        receiver: upline._id,
        amount: currentLevelConfig.upgrade,
        level: nextLevel,
        status: "pending",
      });
      await upgradeDonation.save();

      user.donationsSent.push(upgradeDonation._id);
      upline.donationsReceived.push(upgradeDonation._id);

      await user.save();
      await upline.save();
    }

    return {
      upgraded: true,
      newLevel: nextLevel,
      upgradeDonationTo: upline?.name || "Unknown",
    };
  }

  return {
    upgraded: false,
    totalReceived,
    required: currentLevelConfig.upgrade,
  };
};

module.exports = { checkAndUpgradeLevel };
