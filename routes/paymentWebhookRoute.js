const router = require("express").Router();
const { razorpayWebhook } = require("../controllers/paymentWebhookController");

router.post("/webhook", razorpayWebhook);

module.exports = router;
