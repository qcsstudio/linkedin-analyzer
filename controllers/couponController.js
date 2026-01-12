const Coupon = require("../models/Coupon");
const User = require("../models/User");

// apply coupon
exports.applyCoupon = async (req, res) => {
  try {
    const user = req.user;
    const { code } = req.body;

    if (!code) return res.status(400).json({ success: false, message: "Coupon code required" });

    const coupon = await Coupon.findOne({ code, valid: true });

    if (!coupon) return res.status(400).json({ success: false, message: "Invalid coupon" });

    if (coupon.usedBy.includes(user._id)) {
      return res.status(400).json({ success: false, message: "Coupon already used" });
    }

    // activate free plan for user
    user.hasActivePlan = true;
    user.plan = "free";
    user.planExpiresAt = new Date(Date.now() + coupon.durationDays * 24 * 60 * 60 * 1000);
    await user.save();

    // mark coupon as used by this user
    coupon.usedBy.push(user._id);
    await coupon.save();

    res.json({ success: true, message: `Free ${coupon.durationDays} days activated!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
