const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// models/User.js
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["job_seeker", "recruiter", "founder_ceo", "sales"],
      default: "job_seeker",
    },
    hasPaid: { type: Boolean, default: false }
  },
  {
    timestamps: true 
  }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", userSchema);