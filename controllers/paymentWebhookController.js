const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const rawBody = req.body; // Buffer from express.raw

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event !== "payment.captured") {
      return res.json({ status: "ignored" });
    }

    const paymentEntity = event.payload.payment.entity;

    const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });

    if (!payment) return res.json({ status: "payment_not_found" });

    if (payment.status === "paid") return res.json({ status: "already_processed" });

    payment.status = "paid";
    payment.razorpayPaymentId = paymentEntity.id;
    payment.amount = paymentEntity.amount / 100;
    payment.currency = paymentEntity.currency;
    payment.method = paymentEntity.method;
    payment.offerId = paymentEntity.offer_id || null;
    payment.email = paymentEntity.email;
    payment.contact = paymentEntity.contact;
    payment.paidAt = new Date();

    await payment.save();

    await User.findByIdAndUpdate(payment.user, { isPaid: true });

    return res.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Webhook failed" });
  }
};
