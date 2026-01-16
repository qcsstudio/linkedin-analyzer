const express = require("express");
const router = express.Router();
const { razorpayWebhook } = require("../controllers/paymentWebhookController");

// use raw body ONLY for this webhook route
router.post("/", express.raw({ type: "application/json" }), razorpayWebhook);

module.exports = router; // export the router, NOT an object
