module.exports.planMiddleware = (req, res, next) => {
  // trial or paid plan must be active
  if (!req.user.hasActivePlan) {
    return res.status(403).json({
      success: false,
      code: "PAYMENT_REQUIRED",
      message: "Free trial expired. Please purchase a plan."
    });
  }

  // expiry check (trial or paid)
  if (req.user.planExpiresAt && req.user.planExpiresAt < new Date()) {
    return res.status(403).json({
      success: false,
      code: "PAYMENT_REQUIRED",
      message: "Your free access has expired. Please complete payment."
    });
  }

  next();
};
