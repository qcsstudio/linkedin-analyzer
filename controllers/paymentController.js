const Payment = require("../models/Payment");
const User = require("../models/User");
const { createOrder, verifySignature } = require("../services/razorpayService");

exports.createOrderController = async (req, res) => {
  if (req.user.hasActivePlan) {
    return res.status(400).json({ message: "Plan already active" });
  }

  const order = await createOrder(req.user._id);

  await Payment.create({
    user: req.user._id,
    amount: 49,
    currency: "INR",
    razorpayOrderId: order.id,
    status: "created",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  res.json({ success: true, order });
};

exports.verifyPaymentController = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
    user: req.user._id
  });

  if (!payment) {
    return res.status(403).json({ message: "Unauthorized payment" });
  }

  if (payment.status === "paid") {
    return res.status(400).json({ message: "Already verified" });
  }

  const isValid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.paidAt = new Date();
  await payment.save();

  // 🔓 UNLOCK USER
  await User.findByIdAndUpdate(req.user._id, {
    isPaid: true
  });

  res.json({ success: true, message: "Payment successful" });
};
