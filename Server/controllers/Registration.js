const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { findMatrixSlot } = require("../utils/matrix"); // This utility needs to handle the no-referrer case
require("dotenv").config();

// Ensure process.env.JWT_SECRET is set in your .env file
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, referredBy } = req.body; // referredBy will be the referralCode

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    let referrer = null;
    let slotUser = null;

    if (referredBy) {
      console.log("referredBy", referredBy);
      // Case 1: Referral code provided by the new user
      referrer = await User.findOne({ referralCode: referredBy });
      console.log("referrer", referrer);
      if (!referrer) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid referrer code provided." });
      }
      // Find a slot under the provided referrer
      console.log(referrer._id);
      slotUser = await findMatrixSlot(referrer._id);
      if (!slotUser) {
        return res
          .status(400)
          .json({
            success: false,
            message: `No available matrix slot found under referrer with ID: ${referrer._id}.`,
          });
      }
    } else {
      // Case 2: No referral code provided, place under an admin
      referrer = await User.findOne({ role: "admin" }); // Find any admin user
      if (!referrer) {
        // This is a critical error if no admin exists to place unreferred users
        return res
          .status(500)
          .json({
            success: false,
            message:
              "No admin user found to place unreferred signups. Please ensure an admin account exists.",
          });
      }
      console.log(
        `No referral code provided. Placing user under admin: ${referrer.email}`
      );

      // Find a slot under the found admin user
      slotUser = await findMatrixSlot(referrer._id);
      if (!slotUser) {
        // This might happen if the admin's direct slots are full and `findMatrixSlot` can't find a deeper slot.
        return res
          .status(500)
          .json({
            success: false,
            message:
              "Admin's matrix slots are full. Unable to place new user without referral.",
          });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    // Generate a unique referral code for the new user based on their _id
    // This will be set by the schema's default function, but ensure _id is available first
    // For now, let's keep the simple unique code generation here, or rely on schema default
    const newReferralCode =
      "R" +
      Date.now().toString().slice(-4) +
      Math.random().toString(36).substring(2, 5).toUpperCase(); // More unique

    const newUser = new User({
      name,
      email,
      password: hashed,
      // confirmPassword is not stored in DB, only used for validation
      referralCode: newReferralCode, // Assign generated code
      referredBy: slotUser ? slotUser.referralCode : null, // Set referredBy to the referralCode of the user they are placed under
      currentLevel: 0, // Initial level, can be updated upon activation/donation
    });

    await newUser.save(); // Save the new user first to get their _id

    // Now, update the slotUser (if one exists) with the new user as a child/direct referral
    if (slotUser) {
      // Add new user to the slotUser's matrixChildren
      slotUser.matrixChildren.push(newUser._id);
      await slotUser.save();
          // If a referrer was identified (either explicit or admin), add new user to their directReferrals
      // This ensures the person who directly "referred" (or system placed under) gets the direct referral credit.
      if (referrer) {
        referrer.directReferrals.push(newUser._id);
        await referrer.save(); // Save the referrer to persist directReferrals update
      }


    }

    res.status(201).json({
      success: true,
      _id: newUser._id,
      email: newUser.email, // Include email in response
      name: newUser.name, // Include name in response
      referralCode: newUser.referralCode, // Include new user's referral code
      token: generateToken(newUser._id), // Use newUser._id for token generation
      message: "Registration successful. Please activate your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration. Please try again later.",
      });
  }
};

// ... (your login and changePassword exports remain the same)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please fill up all the required fields`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Login successful
    const token = generateToken(user._id);
    user.token = token;
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      // secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
      // sameSite: 'Lax', // Adjust as needed for CORS
    };

    // Set cookie and return response
    res
      .cookie("token", token, options)
      .status(200)
      .json({
        // Renamed cookie to 'token' for clarity
        success: true,
        token,
        user: {
          // Return necessary user details
          _id: user._id,
          name: user.name, // Assuming 'name' is used as username
          email: user.email,
          currentLevel: user.currentLevel,
          walletBalance: user.walletBalance,
          referralCode: user.referralCode, // Include referral code
          role: user.role, // Include role
          token: token, // Include token in user object for client-side use
        },
        message: "User login successful",
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Ensure req.user.id is populated by a preceding authentication middleware (like verifyToken)
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: User not authenticated.",
        });
    }

    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body; // Added confirmNewPassword

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password and confirm new password do not match.",
        });
    }

    // Validate old password
    const match = await bcrypt.compare(oldPassword, userDetails.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "The old password is incorrect" });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10); // Hash the new password
    // Only update the 'password' field, 'confirmPassword' is for client-side validation
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashed }, // Only update password
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

//  logout controller
exports.logout = async (req, res) => {
  try {
    // Clear the cookie that stores the authentication token
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(" Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
