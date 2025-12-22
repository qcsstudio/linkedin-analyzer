const Razorpay = require("razorpay");
const crypto = require("crypto");

const PLAN_AMOUNT = 49; // INR

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (userId) => {
  return razorpay.orders.create({
    amount: PLAN_AMOUNT * 100, // ₹49 only
    currency: "INR",
    notes: {
      userId: userId.toString(),
      plan: "monthly"
    }
  });
};

exports.verifySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
