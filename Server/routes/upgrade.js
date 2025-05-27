const express = require("express");
const { checkAndUpgradeLevel } = require("../utils/upgradeLogic");

const router = express.Router();

router.post("/check-upgrade", async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await checkAndUpgradeLevel(userId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upgrade check failed" });
  }
});

// routes/upgradeRoutes.js

const { initiateUpgrade } = require("../controllers/Upgrade");
const { approveUpgrade } = require("../controllers/Admin");

// User routes
router.post("/", initiateUpgrade);

// Admin routes
router.post("/approve", approveUpgrade);

module.exports = router;
