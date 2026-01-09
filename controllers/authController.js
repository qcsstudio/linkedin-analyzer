const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AnalyzedProfile = require("../models/AnalyzedProfile");
 const { normalizeRole } = require("../utils/roleNormalizer");

exports.signup = async (req, res) => {
  try {
    
    const { email, password, phone, role, url } = req.body;

    const normalizedRole = normalizeRole(role);

  const FREE_DAYS = 7;

const user = await User.create({
  email,
  password,
  phone,
  role: normalizedRole,
  plan: "free",
  hasActivePlan: true,
  planExpiresAt: new Date(Date.now() + FREE_DAYS * 24 * 60 * 60 * 1000)
});



    console.log( user._id);

    const profile = await AnalyzedProfile.findOneAndUpdate(
      { url },
      { $set: { userId: user._id, professionalRole: normalizedRole } },
      { new: true }
    );

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔐 Token generated");

    res.json({ success: true, token });

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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
