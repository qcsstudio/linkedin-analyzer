const mongoose = require("mongoose");

const analyzedProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  url: { type: String, unique: true, required: true },

  professionalRole: {
    type: String,
    enum: ["job_seeker","founder","sales","consultant","recruiter"],
    required: true
  },

  profileData: { type: Object, required: true },
  profileText: { type: String, required: true },

  score: Number,
  baseScore: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AnalyzedProfile", analyzedProfileSchema);
