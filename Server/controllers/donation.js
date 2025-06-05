// controllers/donation.js
const express = require("express");
const Donation = require("../models/Donation");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");
const { v4: uuidv4 } = require("uuid");
const { razorpayinstance } = require("../config/razorpay");
const mongoose = require("mongoose");
const { LEVELS_CONFIG } = require("../config/levels"); // Import the config
const crypto = require("crypto"); // Added for signature verification

// Create Razorpay Order API
exports.capturePayment = async (req, res) => {
  // const userId = req.user._id;
  const { userId , currentLevel } = req.body; // This 'currentLevel' is the level being activated

  try {
    // Validate input
    console.log(`Initiating payment for userId: ${userId}, Level: ${currentLevel}`);
    if (!userId || currentLevel === undefined || currentLevel === null || currentLevel <= 0) {
      return res.status(400).json({ message: "Missing or invalid required fields: userId or currentLevel" });
    }

    const donor = await User.findById(userId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found." });
    }

    // --- Level Activation Logic & Validation ---
    // Check if the donor has already activated this level or a higher level
    if (donor.currentLevel >= currentLevel) {
      return res.status(400).json({ message: `Level ${currentLevel} is already activated or a higher level is active for this user.` });
    }

    // Ensure sequential level activation (e.g., cannot activate Level 3 without Level 2)
    // Only applies if currentLevel > 1. For Level 1, donor.currentLevel should be 0 or undefined.
    if (currentLevel > 1 && donor.currentLevel < currentLevel - 1) {
      return res.status(400).json({ message: `Please activate Level ${currentLevel - 1} before activating Level ${currentLevel}.` });
    }
    // --- End Level Activation Logic & Validation ---

    // Get amount from LEVELS_CONFIG
    const levelInfo = LEVELS_CONFIG[currentLevel];
    if (!levelInfo) {
      return res.status(400).json({ message: `Configuration not found for Level ${currentLevel}.` });
    }

    const amountInRupees = levelInfo.amount;
    const amountInPaise = amountInRupees * 100; // Convert to paise for Razorpay

    // Find the upline (referredBy)
    const receiver = await User.findOne({ referralCode: donor.referredBy });
    if (!receiver) {
      // This should ideally not happen for a valid user or means they are the very first user.
      // Adjust this based on your platform's onboarding logic (e.g., assign to an admin if no upline)
      return res.status(404).json({ message: "Upline (receiver) not found for the donor. Cannot process donation." });
    }

    // Find the sponsor (sponserdBy) - optional
    const sponser = donor.sponserdBy ? await User.findOne({ referralCode: donor.sponserdBy }) : null;
    // If sponsor is mandatory and not found, add a check here.

    const options = {
      amount: amountInPaise.toString(), // Use the dynamically determined amount
      currency: "INR",
      receipt: uuidv4(),
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId.toString(),
        currentLevel: currentLevel.toString(), // Store the level being activated
        receiverId: receiver._id.toString(),
        ...(sponser && { sponserId: sponser._id.toString() }),
      },
    };

    const order = await razorpayinstance.orders.create(options);
    console.log("Razorpay order created:", order);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};

// Razorpay Webhook Handler (for payment verification)
// exports.verifyPayment = async (req, res) => {
//   const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   const signature = req.headers["x-razorpay-signature"];

//   // It's crucial to get the raw body for signature verification.
//   // Ensure your Express app uses `express.raw({ type: 'application/json' })` for this route.
//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");
// console.log(signature,"-->>")
// console.log(digest)

//   if (signature === digest) {
//     console.log("Payment is Authorized via webhook signature verification.");
//     const { event, payload } = req.body; // Razorpay sends events and payload

//     // We only care about 'payment.captured' event for successful transactions
//     if (event !== 'payment.captured') {
//       return res.status(200).json({ success: true, message: `Event type ${event} received, not processing.` });
//     }

//     const payment = payload.payment.entity; // This is the payment entity from Razorpay
//     const orderId = payment.order_id;
//     const paymentId = payment.id;

//     // Extract notes from the payment entity, not directly from payload
//     const { userId, currentLevel, receiverId, sponserId } = payment.notes;

//     if (!orderId || !paymentId || !userId || currentLevel === undefined || currentLevel === null || !receiverId) {
//       console.error("Webhook data missing required parameters:", { orderId, paymentId, userId, currentLevel, receiverId });
//       return res.status(400).json({ success: false, message: "Webhook data missing required parameters." });
//     }

//     // Convert currentLevel to a number as it comes from notes (string)
//     const levelToActivate = parseInt(currentLevel, 10);
//     const levelInfo = LEVELS_CONFIG[levelToActivate];

//     if (!levelInfo) {
//       console.error(`Configuration not found for activated Level: ${levelToActivate}`);
//       return res.status(400).json({ success: false, message: `Configuration not found for Level ${levelToActivate}.` });
//     }

//     // Using a try-catch block for the entire payment processing logic
//     try {
//       // Fetch donor, receiver, and sponsor details
//       const donor = await User.findById(userId).select(
//         "+walletBalance +walletTransactions +currentLevel +donationsSent"
//       );
//       const receiver = await User.findById(receiverId).select(
//         "+walletBalance +walletTransactions +donationsReceived"
//       );
//       let sponser = null;
//       if (sponserId) {
//         sponser = await User.findById(sponserId).select(
//           "+walletBalance +walletTransactions"
//         );
//       }

//       if (!donor || !receiver) {
//         console.error(`Donor or Receiver not found for transaction. Donor: ${donor}, Receiver: ${receiver}`);
//         return res.status(404).json({ message: "Donor or Receiver not found." });
//       }

//       // Re-verify that the payment amount matches the expected amount for the level
//       const expectedAmount = levelInfo.amount * 100; // Expected amount in paise
//       if (payment.amount !== expectedAmount) {
//         console.warn(`Amount mismatch for order ${orderId}. Expected: ${expectedAmount}, Received: ${payment.amount}`);
//         // You might still process, or flag, or revert depending on strictness
//         return res.status(400).json({ success: false, message: "Amount mismatch for the activated level." });
//       }

//       // Initialize wallets if they are undefined (new users)
//       if (donor.walletBalance === undefined) donor.walletBalance = 0;
//       if (receiver.walletBalance === undefined) receiver.walletBalance = 0;
//       if (sponser && sponser.walletBalance === undefined) sponser.walletBalance = 0;

//       const amount = payment.amount / 100; // Convert back to rupees from paise
//       const transactionId = uuidv4();

//       // Save all changes in a transaction for atomicity
//       const session = await mongoose.startSession();
//       session.startTransaction();

//       try {
//         // Check if a donation with this paymentId/orderId already exists to prevent double processing
//         const existingDonation = await Donation.findOne({ paymentId: paymentId }).session(session);
//         if (existingDonation) {
//             console.log(`Donation with paymentId ${paymentId} already processed. Skipping.`);
//             await session.commitTransaction(); // Commit to release lock
//             session.endSession();
//             return res.status(200).json({ success: true, message: "Donation already processed." });
//         }

//         // Create donation record
//         const donation = new Donation({
//           donor: donor._id,
//           receiver: receiver._id,
//           amount,
//           currentLevel: levelToActivate, // Use the parsed level
//           status: "completed",
//           transactionId,
//           paymentId: paymentId,
//           orderId: orderId,
//         });

//         await donation.save({ session });

//         // Update receiver's wallet
//         const receiverShare = levelInfo.receiverShare;
//         receiver.walletBalance += receiverShare;
//         receiver.walletTransactions.push({
//           amount: receiverShare,
//           type: "donation_received",
//           status: "completed",
//           donationLevel: levelToActivate,
//           fromUser: donor._id,
//           referenceId: donation._id,
//           transactionId: donation.transactionId,
//           description: `Donation from ${donor.name || donor.email} for Level ${levelToActivate}`,
//           processedAt: new Date(),
//         });

//         // Update sponsor's wallet if sponsor exists and has a share
//         const sponsorShare = levelInfo.sponsorShare || 0; // Default to 0 if not defined
//         if (sponser && sponsorShare > 0) {
//           sponser.walletBalance += sponsorShare;
//           sponser.walletTransactions.push({
//             amount: sponsorShare,
//             type: "sponser_payment",
//             status: "completed",
//             donationLevel: levelToActivate,
//             fromUser: donor._id,
//             referenceId: donation._id,
//             transactionId: donation.transactionId,
//             description: `Sponsor payment from ${donor.name || donor.email} for Level ${levelToActivate}`,
//             processedAt: new Date(),
//           });
//           await sponser.save({ session });
//         }

//         // Add transaction record for donor
//         donor.walletTransactions.push({
//           amount: -amount, // Negative amount to represent payment sent
//           type: "donation_sent",
//           status: "completed",
//           donationLevel: levelToActivate,
//           toUser: receiver._id,
//           referenceId: donation._id,
//           transactionId,
//           description: `Payment for Level ${levelToActivate} to ${receiver.name || receiver.email} via Razorpay`,
//           processedAt: new Date(),
//         });

//         // Update user donation references and donor's current level
//         donor.donationsSent.push(donation._id);
//         // This is the crucial part: update donor's current level to the activated level
//         if (donor.currentLevel < levelToActivate) {
//           donor.currentLevel = levelToActivate;
//         } else {
//              // This case should ideally not happen if capturePayment validation is strict
//              console.warn(`Donor's currentLevel (${donor.currentLevel}) is already >= activated level (${levelToActivate}).`);
//         }
        
//         receiver.donationsReceived.push(donation._id);

//         await donor.save({ session });
//         await receiver.save({ session });

//         await session.commitTransaction();

//         // Respond with the updated donor object to help frontend refresh user state
//         const updatedDonor = await User.findById(userId).select("-password -walletTransactions"); // Exclude sensitive info
//         res.status(200).json({
//           success: true,
//           message: "Payment verified and processed successfully.",
//           data: updatedDonor, // Send updated user data back to frontend
//         });
//       } catch (error) {
//         await session.abortTransaction();
//         console.error("Transaction failed during payment verification:", error);
//         res.status(500).json({ success: false, message: "Transaction failed", error: error.message });
//       } finally {
//         session.endSession();
//       }
//     } catch (err) {
//       console.error("Payment processing error outside of transaction:", err);
//       res.status(500).json({
//         success: false,
//         message: "Failed to process payment after webhook verification",
//         error: err.message,
//       });
//     }
//   } else {
//     // If signatures don't match, it's an unauthorized request
//     console.warn("Unauthorized webhook access: Invalid signature.");
//     res.status(403).json({ success: false, message: "Invalid signature" });
//   }
// };
exports.verifyPayment = async (req, res) => {
    // Data sent from frontend's Razorpay handler
    const {userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, currentLevel } = req.body;
    // const userId = req.user.id; // From auth middleware

    // 1. Validate incoming data
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        currentLevel === undefined || currentLevel === null ||
        !userId
    ) {
        console.error("Missing required payment verification parameters:", { razorpay_order_id, razorpay_payment_id, razorpay_signature, currentLevel, userId });
        return res.status(400).json({ success: false, message: "Payment verification failed: Missing required data." });
    }

    // 2. Verify Razorpay Signature (Essential for security)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET) // Use RAZORPAY_KEY_SECRET
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        console.warn("Payment verification failed: Signature mismatch.");
        return res.status(400).json({ success: false, message: "Payment verification failed: Invalid signature." });
    }

    // 3. Fetch Donor and Level Configuration
    const levelToActivate = parseInt(currentLevel, 10);
    const levelInfo = LEVELS_CONFIG[levelToActivate];

    if (!levelInfo) {
        console.error(`Configuration not found for activated Level: ${levelToActivate}`);
        return res.status(400).json({ success: false, message: `Configuration not found for Level ${levelToActivate}.` });
    }

    const donor = await User.findById(userId).select(
        "+walletBalance +walletTransactions +currentLevel +donationsSent +referredBy +sponserdBy"
    );

    if (!donor) {
        console.error("Donor not found for payment verification.");
        return res.status(404).json({ success: false, message: "Donor not found." });
    }

    // Additional check: Ensure this level is not already activated or higher
    if (donor.currentLevel >= levelToActivate) {
        console.warn(`User ${userId} attempted to activate already active or lower level ${levelToActivate}. Current level: ${donor.currentLevel}`);
        // Consider this a success, as the level is already active.
        const updatedDonor = await User.findById(userId).select("-password -walletTransactions");
        return res.status(200).json({ success: true, message: "Level already activated.", data: updatedDonor });
    }
    // Also, ensure previous level is activated if required
    if (levelToActivate > 1 && donor.currentLevel < levelToActivate - 1) {
        console.error(`Payment for Level ${levelToActivate} received but Level ${levelToActivate - 1} is not activated for user ${userId}`);
        return res.status(400).json({ success: false, message: `Please activate Level ${levelToActivate - 1} first.` });
    }


    // 4. Fetch Receiver and Sponsor (upline network)
    const receiver = await User.findOne({ referralCode: donor.referredBy });
    if (!receiver) {
        console.error(`Receiver not found for donor ${userId} with referralCode ${donor.referredBy}.`);
        return res.status(400).json({ success: false, message: "Upline (receiver) not found. Cannot complete donation." });
    }

    let sponser = null;
    if (donor.sponserdBy) {
        sponser = await User.findOne({ referralCode: donor.sponserdBy });
    }

    // 5. Verify Amount (Optional but Recommended - fetches from Razorpay API)
    // This adds another layer of security, verifying the actual amount captured by Razorpay.
    try {
        const paymentDetails = await razorpayinstance.payments.fetch(razorpay_payment_id);
        const expectedAmountInPaise = levelInfo.amount * 100;
        
        if (paymentDetails.status !== 'captured') {
            console.error(`Payment ${razorpay_payment_id} status is not captured: ${paymentDetails.status}`);
            return res.status(400).json({ success: false, message: "Payment not captured by Razorpay." });
        }
        if (paymentDetails.amount !== expectedAmountInPaise) {
            console.error(`Amount mismatch for payment ${razorpay_payment_id}. Expected: ${expectedAmountInPaise}, Received: ${paymentDetails.amount}`);
            return res.status(400).json({ success: false, message: "Payment amount mismatch." });
        }
        if (paymentDetails.order_id !== razorpay_order_id) {
            console.error(`Order ID mismatch for payment ${razorpay_payment_id}. Expected: ${razorpay_order_id}, Received: ${paymentDetails.order_id}`);
            return res.status(400).json({ success: false, message: "Payment order ID mismatch." });
        }

    } catch (error) {
        console.error("Error fetching payment details from Razorpay API:", error);
        return res.status(500).json({ success: false, message: "Failed to verify payment with Razorpay API." });
    }

    // 6. Perform Database Updates within a Transaction
    const amount = levelInfo.amount; // Use amount from config after verification
    const transactionId = uuidv4();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Idempotency check: prevent double processing
        const existingDonation = await Donation.findOne({ paymentId: razorpay_payment_id }).session(session);
        if (existingDonation) {
            console.log(`Donation with paymentId ${razorpay_payment_id} already processed. Skipping.`);
            await session.commitTransaction();
            session.endSession();
            const updatedDonor = await User.findById(userId).select("-password -walletTransactions");
            return res.status(200).json({ success: true, message: "Donation already processed.", data: updatedDonor });
        }

        // Create new Donation record
        const donation = new Donation({
            donor: donor._id,
            receiver: receiver._id,
            amount,
            currentLevel: levelToActivate,
            status: "completed",
            transactionId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });
        await donation.save({ session });

        // 1. Receiver's transaction (Donation Received)
        const receiverShare = levelInfo.receiverShare;
        const receiverTxn = new WalletTransaction({
            amount: receiverShare,
            type: "donation_received",
            status: "completed",
            donationLevel: levelToActivate,
            fromUser: donor._id, // The donor is the 'fromUser' for receiver's income
            referenceId: donation._id, // Reference the Donation document
            transactionId: donation.transactionId,
            description: `Donation from ${donor.name || donor.email} for Level ${levelToActivate}`,
            processedAt: new Date(),
        });
        await receiverTxn.save({ session });
        receiver.walletBalance = (receiver.walletBalance || 0) + receiverShare;
        receiver.walletTransactions.push(receiverTxn._id); // Push only the ID
        receiver.donationsReceived.push(donation._id);

        // 2. Sponsor's transaction (if applicable)
        const sponsorShare = levelInfo.sponsorShare || 0;
        if (sponser && sponsorShare > 0) {
            const sponsorTxn = new WalletTransaction({
                amount: sponsorShare,
                type: "sponser_payment",
                status: "completed",
                donationLevel: levelToActivate,
                fromUser: donor._id, // The donor is the 'fromUser' for sponsor's income
                referenceId: donation._id,
                transactionId: donation.transactionId,
                description: `Sponsor payment from ${donor.name || donor.email} for Level ${levelToActivate}`,
                processedAt: new Date(),
            });
            await sponsorTxn.save({ session });
            sponser.walletBalance = (sponser.walletBalance || 0) + sponsorShare;
            sponser.walletTransactions.push(sponsorTxn._id); // Push only the ID
            await sponser.save({ session }); // Save sponsor separately in transaction
        }

        // 3. Donor's transaction (Donation Sent)
        const donorTxn = new WalletTransaction({
            amount: -amount, // Negative for expense
            type: "donation_sent",
            status: "completed",
            donationLevel: levelToActivate,
            toUser: receiver._id, // The receiver is the 'toUser' for donor's expense
            referenceId: donation._id,
            transactionId: donation.transactionId,
            description: `Payment for Level ${levelToActivate} to ${receiver.name || receiver.email} via Razorpay`,
            processedAt: new Date(),
        });
        await donorTxn.save({ session });
        donor.walletTransactions.push(donorTxn._id); // Push only the ID
        donor.donationsSent.push(donation._id);
        donor.currentLevel = levelToActivate;

        // Save donor and receiver (sponser was saved if applicable)
        await donor.save({ session });
        await receiver.save({ session });

        await session.commitTransaction();

        const updatedDonor = await User.findById(userId).select("-password -walletTransactions");
        return res.status(200).json({
            success: true,
            message: "Payment verified and level activated successfully.",
            data: updatedDonor,
        });
    } catch (error) {
        await session.abortTransaction(); // Rollback on error
        console.error("Database transaction failed during payment verification:", error);
        return res.status(500).json({ success: false, message: "Payment processing failed.", error: error.message });
    } finally {
        session.endSession(); // End the session
    }
};