const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 💰 REAL AMOUNT PAID (₹1 / ₹49)
    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: String,

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },

    // 🔍 PAYMENT META (VERY IMPORTANT)
    method: String,              // upi / card / netbanking
    offerId: String,             // offer_S3GoeqLhpPxKCZ
    email: String,
    contact: String,

    paidAt: Date,

    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
