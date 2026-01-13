const Razorpay = require("razorpay");
const crypto = require("crypto");

const PLAN_AMOUNT = 49; // INR

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (userId) => {
  const orderData = {
    amount: PLAN_AMOUNT * 100,
    currency: "INR",
    notes: {
      userId: userId.toString(),
      plan: "monthly"
    }
  };

  // attach Razorpay offer (if active)
  if (process.env.RAZORPAY_OFFER_ID) {
    orderData.offers = [process.env.RAZORPAY_OFFER_ID];
  }

  return razorpay.orders.create(orderData);
};


exports.verifySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
