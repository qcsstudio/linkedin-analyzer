const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.authMiddleware = async (req, res, next) => {
try {
const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(401).json({ message: "No token" });


const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);
if (!user) return res.status(401).json({ message: "Invalid token" });


req.user = user;
next();
} catch (err) {
res.status(401).json({ message: "Unauthorized" });
}
};