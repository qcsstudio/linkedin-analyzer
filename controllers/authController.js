const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AnalyzedProfile = require("../models/AnalyzedProfile");
 const { normalizeRole } = require("../utils/roleNormalizer");


const mapRoleToAccountType = (role) => {
  if (role === "job_seeker") return "job_seeker";
  if (role === "recruiter_talent") return "recruiter";
  if (role === "sales_sdr_ae") return "sales";
  return role; // founder_ceo, consultant_coach
};
exports.signup = async (req, res) => {
  try {
    console.log("➡️ SIGNUP HIT");
    console.log("📦 BODY:", req.body);

    const { email, password, phone, role, url } = req.body;

    console.log("🔄 Normalizing role...");
    const normalizedRole = normalizeRole(role);
    console.log("✅ Normalized role:", normalizedRole);

    const user = await User.create({
      email,
      password,
      phone,
      role: normalizedRole,
      plan: "free"
    });

    console.log("👤 User created:", user._id);

    const profile = await AnalyzedProfile.findOneAndUpdate(
      { url },
      { $set: { userId: user._id, professionalRole: normalizedRole } },
      { new: true }
    );

    console.log("🔗 Profile linked:", profile ? "YES" : "NO");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔐 Token generated");

    res.json({ success: true, token });

  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
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
