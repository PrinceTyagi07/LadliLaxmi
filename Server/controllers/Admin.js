const User = require('../models/User');

// 1. Get all users (excluding password, with donations populated)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('donationsSent donationsReceived');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// 2. Get total count of users
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Error counting users:", err);
    res.status(500).json({ error: 'Error counting users' });
  }
};

// 3. Delete a user by ID
exports.deleteUser = async (req, res) => {
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
};
