const {auth} = require("../middleware/auth")
const express = require("express");
const router = express.Router();
const {capturePayment , verifyPayment} = require("../controllers/donation.js")

router.post('/create-order',capturePayment);
router.post('/verify-payment',verifyPayment);


module.exports = router;