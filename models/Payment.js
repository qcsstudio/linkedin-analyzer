const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },

  paidAt: Date,

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
