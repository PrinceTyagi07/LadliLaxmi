const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { isAdmin } = require('../middleware/auth'); // Assuming isAdmin is already defined
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const router = express.Router();

// Define your JWT secret key.
// In a real application, this should be stored securely (e.g., in environment variables).
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Replace with a strong, unique secret

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    // Verify the token
    jwt.verify(req.token, JWT_SECRET, (err, authData) => {
      if (err) {
        // Token is invalid or expired
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
      } else {
        // Token is valid, attach user data to request
        req.user = authData.user; // Assuming your token payload has a 'user' object
        next(); // Proceed to the next middleware/route handler
      }
    });
  } else {
    // Forbidden (No token)
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
};

// 1. All users list
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('donationsSent donationsReceived');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// 2. All donations list
router.get('/donations', isAdmin, async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor receiver');
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

// 3. Approve a donation
router.post('/donation/approve', isAdmin, async (req, res) => {
  const { donationId } = req.body;
  try {
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = 'approved';
    await donation.save();
    res.json({ message: 'Donation approved' });
  } catch (err) {
    console.error("Error approving donation:", err);
    res.status(500).json({ error: 'Error approving donation' });
  }
});

// 4. Reject a donation
router.post('/donation/reject', isAdmin, async (req, res) => {
  const { donationId } = req.body;
  try {
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = 'rejected';
    await donation.save();
    res.json({ message: 'Donation rejected' });
  } catch (err) {
    console.error("Error rejecting donation:", err);
    res.status(500).json({ error: 'Error rejecting donation' });
  }
});

// 5. Stats summary
router.get('/summary', isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const approved = await Donation.countDocuments({ status: 'approved' });
    const pending = await Donation.countDocuments({ status: 'pending' });

    res.json({
      usersCount,
      totalDonations,
      approved,
      pending,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: 'Error fetching summary' });
  }
});

// Route to delete a user, now protected by verifyToken and isAdmin
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
