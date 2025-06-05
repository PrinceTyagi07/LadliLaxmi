// config/level.js
exports.LEVELS_CONFIG = {
  1: { amount: 400, receiverShare: 300, sponsorShare: 100, description: "Level 1 Activation" },
  2: { amount: 800, receiverShare: 700, sponsorShare: 100, description: "Level 2 Activation" },
  3: { amount: 1600, receiverShare: 1500, sponsorShare: 100, description: "Level 3 Activation" },
  // Add more levels here as needed
  // Ensure receiverShare + sponsorShare = amount, or handle platform fee if applicable
};