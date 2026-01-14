module.exports.planMiddleware = (req, res, next) => {
  if (!req.user.isPaid) {
    return res.status(403).json({
      success: false,
      code: "PAYMENT_REQUIRED",
      message: "Please complete payment to unlock suggestions."
    });
  }

  next();
};
