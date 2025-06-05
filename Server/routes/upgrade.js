const express = require("express");
const {initiateUpgrade}=require("../controllers/Upgrade")

const router = express.Router();

// User routes
router.post("/", initiateUpgrade);

module.exports = router;
