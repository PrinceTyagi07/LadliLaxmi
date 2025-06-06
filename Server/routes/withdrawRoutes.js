const express = require('express')
const { auth } = require("../middleware/auth");
const { WithdrawRequest } = require("../controllers/Withdraw");

const router = express.Router();


router.post("/request",auth, WithdrawRequest); // ✅ Fixed route
// router.post("/request/:id", WithdrawRequest); // ✅ Fixed route

module.exports = router;