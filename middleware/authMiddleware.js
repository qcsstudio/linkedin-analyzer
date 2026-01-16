const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT"); // 👈 always logs

  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      console.log("Authorization header missing");
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Extract token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      console.log("Token missing");
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found for decoded token ID:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // ✅ Better logging for Mongoose documents
    console.log("USER FOUND:", JSON.stringify(user, null, 2));
    console.log("------");

    // Attach user to request object
    req.user = user;

    // Proceed to next middleware/route
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};
