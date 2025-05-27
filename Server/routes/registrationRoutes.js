const {auth} = require("../middleware/auth")
const express = require("express");
const {register , logout ,login , changePassword} = require("../controllers/Registration")
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/changepassword',changePassword);

module.exports = router;