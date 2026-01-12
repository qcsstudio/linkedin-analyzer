const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AnalyzedProfile = require("../models/AnalyzedProfile");
 const { normalizeRole } = require("../utils/roleNormalizer");

exports.signup = async (req, res) => {
  try {
    const { email, password, phone, role, url } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: "email, password, role required" });

    const normalizedRole = normalizeRole(role);

    // create user WITHOUT activating free trial
    const user = await User.create({
      email,
      password,
      phone,
      role: normalizedRole,
      plan: "none",          // no plan yet
      hasActivePlan: false,  // free trial not activated yet
      planExpiresAt: null
    });

    // link analyzed profile (if exists)
    await AnalyzedProfile.updateMany(
      { url },
      {
        $set: {
          userId: user._id,
          professionalRole: normalizedRole
        }
      }
    );

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔐 Token generated for signup:", user._id);

    res.json({ success: true, token, message: "signup successful. use coupon to activate free trial." });
  } catch (err) {
    console.error("Signup error:", err);
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
