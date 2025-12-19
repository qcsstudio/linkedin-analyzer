const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// --------------------
// CREATE ORDER
// --------------------
exports.createOrderController = async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 4900,
      currency: "INR"
    });

    await Payment.create({
      user: req.user._id,
      amount: 49,
      razorpayOrderId: order.id,
      status: "created",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// VERIFY PAYMENT CONTROLLER (THIS WAS MISSING)
// --------------------
exports.verifyPaymentController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 1️⃣ Update payment
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
        paidAt: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 2️⃣ ACTIVATE USER PLAN (THIS WAS MISSING)
    await User.findByIdAndUpdate(payment.user, {
      hasActivePlan: true,
      plan: "paid",
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      message: "Payment verified & plan activated"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
