const User = require("../models/User");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
try {
const { email, phone, password, role } = req.body;
if (!email || !password) return res.status(400).json({ message: "email & password required" });


const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: "User exists" });

console.log("------1")
const user = new User({ email, phone, password, role });
await user.save();
console.log("-----2-1")


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.json({ success: true, token, role: user.role });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.login = async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: "email & password required" });


const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: "User not found" });


const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ message: "Invalid password" });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.json({ success: true, token, role: user.role });
} catch (err) {
res.status(500).json({ message: err.message });
}
};