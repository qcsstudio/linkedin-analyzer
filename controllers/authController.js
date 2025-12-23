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

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please login."
      });
    }

    // 2️⃣ Normalize role FIRST
    const normalizedRole = normalizeRole(role); // <-- HERE: normalize the frontend role

    // 3️⃣ Create user using normalized enum
    const user = await User.create({
      email,
      password,
      phone,
      role: normalizedRole, // ✅ use normalized role here
      plan: "free"
    });

    // 4️⃣ Link analyzed profile using normalized role
    await AnalyzedProfile.updateOne(
      { url },
      { userId: user._id, professionalRole: normalizedRole } // ✅ normalized enum
    );

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
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
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
