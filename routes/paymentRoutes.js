const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    console.log("➡️ authMiddleware hit", req.path);

    const authHeader = req.headers.authorization;
    console.log("auth header:", authHeader);

    if (!authHeader) {
      console.warn("❌ Authorization header missing");
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // handle both formats: "Bearer token" or "token"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    console.log("extracted token:", token);

    if (!token) {
      console.warn("❌ Token missing after parsing header");
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn("❌ User not found for decoded id");
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    console.log("✅ User authenticated:", user.email);

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};
