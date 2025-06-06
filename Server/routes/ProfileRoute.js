const express = require("express");
const { auth } = require("../middleware/auth");
const { getProfile } = require("../controllers/profile");
// const { protect } = require("../middleware/auth"); // You must have this middleware
const router = express.Router();

// router.get("/getprofile", protect,getProfile); // Ensure you have the correct method from your controller
router.get("/getprofile/:id",auth, getProfile); // ✅ Fixed route

module.exports = router;
