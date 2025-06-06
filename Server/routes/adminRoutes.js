const express = require("express");
const { isAdmin } = require("../middleware/auth");
const { getAllUsers, getUserCount, deleteUser } = require("../controllers/Admin");
const router = express.Router();

// Get total user count
router.get("/getalluserCount",isAdmin, getUserCount); 

// Get all users
router.get("/getalluser",isAdmin, getAllUsers); 

// Delete user by ID
router.delete("/deleteUser/:id",isAdmin, deleteUser); 

module.exports = router;
