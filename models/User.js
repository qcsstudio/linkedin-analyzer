const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { normalizeRole } = require("../utils/roleNormalizer");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,

  role: {
    type: String,
    enum: ["job_seeker", "recruiter", "consultant", "sales", "founder"],
    required: true
  },

  plan: {
    type: String,
    enum: ["free", "paid"],
    default: "free"
  },

  hasActivePlan: {
    type: Boolean,
    default: false
  },

  planExpiresAt: {
    type: Date,
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

// password hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema); // ✅ THIS LINE IS REQUIRED
