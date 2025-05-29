const express = require('express')
const { WithdrawRequest } = require("../controllers/Withdraw");

const router = express.Router();


router.post("/request", WithdrawRequest); // ✅ Fixed route
// router.post("/request/:id", WithdrawRequest); // ✅ Fixed route

module.exports = router;