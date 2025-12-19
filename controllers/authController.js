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
    const { email, password, phone, role, url } = req.body;

    if (!email || !password || !role || !url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please login."
      });
    }

    // ✅ 2. Normalize role FIRST
    const normalizedRole = normalizeRole(role);

    // ✅ 3. Create user
    const user = await User.create({
      email,
      password,
      phone,
      accountType: mapRoleToAccountType(normalizedRole),
      plan: "free"
    });

    // ✅ 4. Link analyzed profile SAFELY (no save())
    await AnalyzedProfile.updateOne(
      { url },
      { userId: user._id }
    );

    // ✅ 5. Token
    const token = jwt.sign(
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, accountType: user.accountType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
