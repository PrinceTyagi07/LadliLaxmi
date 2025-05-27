const {auth} = require("../middleware/auth")
const express = require("express");
const {register , login , changePassword} = require("../controllers/Registration")
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/changepassword',changePassword);

module.exports = router;