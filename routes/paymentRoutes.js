const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createOrderController,
  verifyPaymentController
} = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createOrderController);
router.post("/verify", authMiddleware, verifyPaymentController);

module.exports = router;
