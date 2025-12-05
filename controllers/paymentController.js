const User = require("../models/User");
const { createOrder, verifyPayment } = require("../services/razorpayService");

exports.createOrderController = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await createOrder(amount, req.user._id);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPaymentController = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const isValid = verifyPayment(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    req.user.hasPaid = true;
    await req.user.save();

    res.json({ success: true, message: "Payment verified successfully. You can now access suggestions." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
