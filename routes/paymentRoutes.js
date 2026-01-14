const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createOrderController,
  verifyPaymentController
} = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createOrderController);
router.post("/verify", authMiddleware, verifyPaymentController);

module.exports = router;