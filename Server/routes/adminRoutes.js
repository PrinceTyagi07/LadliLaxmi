const express = require("express");
const { getAllUsers, getUserCount, deleteUser } = require("../controllers/Admin");
const router = express.Router();

// Get total user count
router.get("/getalluserCount", getUserCount); 

// Get all users
router.get("/getalluser", getAllUsers); 

// Delete user by ID
router.delete("/deleteUser/:id", deleteUser); 

module.exports = router;
