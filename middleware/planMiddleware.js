module.exports.planMiddleware = (req, res, next) => {
  if (req.user.plan !== "paid") {
    return res.status(403).json({
      message: "Active plan required"
    });
  }

  if (req.user.planExpiresAt && req.user.planExpiresAt < new Date()) {
    return res.status(403).json({
      message: "Plan expired. Please renew."
    });
  }

  next();
};
