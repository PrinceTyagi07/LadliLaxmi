const {auth} = require("../middleware/auth")
const express = require("express");
const router = express.Router();
const {capturePayment , verifyPayment} = require("../controllers/donation")

router.post('/create-order',capturePayment);
router.post('/verify-payment',verifyPayment);
// Route for creating a Razorpay order (frontend calls this)
// router.post('/donations/create-order', auth, capturePayment);

// // Route for frontend-initiated payment verification
// // This is NOT a webhook. It expects JSON body from frontend.
// router.post('/donations/verify-payment', auth, verifyPayment);

module.exports = router;