const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  durationDays: { type: Number, default: 7 }, // how many days free trial
  valid: { type: Boolean, default: true },   // if coupon is active
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // track users who used it
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
