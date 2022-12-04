const express = require("express");
const router = express.Router();

const {isSignedIn,isAuthenticated} = require("../controllers/auth")
const {getToken, processPayment} = require ("../controllers/paymentB")

router.get("/payment/gettoken/:userId", getToken);
router.post("/payment/payPal/:userId", isSignedIn, isAuthenticated, processPayment);


module.exports = router;