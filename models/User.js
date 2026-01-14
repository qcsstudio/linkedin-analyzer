const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,

  role: {
    type: String,
    enum: ["job_seeker", "recruiter", "consultant", "sales", "founder"],
    required: true
  },

  // 🔑 SINGLE SOURCE OF TRUTH
  isPaid: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model("User", userSchema);
