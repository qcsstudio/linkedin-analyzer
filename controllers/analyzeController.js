const client = require("../config/redis");
const { normalizeRole } = require("../utils/roleNormalizer");
const { buildTextFromProfile } = require("../utils/profileTextBuilder");
const { scoreProfileWithRole } = require("../utils/roleAwareScorer");
const { hashProfile } = require("../utils/profileHasher");
const { analyzeProfileAI } = require("../services/aiService");
const { v4: uuidv4 } = require("uuid");
const AnalyzedProfile = require("../models/AnalyzedProfile");

exports.uploadProfileData = async (req, res) => {
  try {
    const profile = req.body;
    const url = profile.url;
    if (!profile || !url) return res.status(400).json({ message: "Profile data and URL required" });

    const selectedRole = normalizeRole(profile.role); // core role
    const profileHash = hashProfile(profile);
    const cacheKey = `profile:${profileHash}:${selectedRole}`;

    // Redis cache
    const cached = await client.get(cacheKey);
    if (cached) return res.json({ success: true, source: "cache", ...JSON.parse(cached) });

    // Compute score
    const text = buildTextFromProfile(profile);
    const result = scoreProfileWithRole(text.toLowerCase(), selectedRole);

    // Upsert profile without overwriting createdAt
    const a = await AnalyzedProfile.findOneAndUpdate(
      { url },
      {
        $set: {
          professionalRole: selectedRole,
          profileData: profile,
          profileText: text,
          score: result.finalScore,
          baseScore: result.baseScore
        },
        $setOnInsert: { createdAt: new Date() } // preserve original creation date
      },
      { upsert: true, new: true, runValidators: true }
    );

  const response = {
  url,
  score: `${result.finalScore}%`,
  baseScore: `${result.baseScore}%`,
  strength:
    result.finalScore < 40
      ? "weak"
      : result.finalScore < 70
      ? "average"
      : "strong",
  potential: `${100 - result.finalScore}%`,

  sections: {
    headline: result.breakdown.headline,
    about: result.breakdown.about,
    experience: result.breakdown.experience,
    skills: result.breakdown.skills,
    education: result.breakdown.education,
    contact: result.breakdown.contact,
    length: result.breakdown.length
  },

  penalties: result.penalties,
  roleMatch: result.roleMatch,
  detectedRole: result.detectedRole,
  selectedRole: result.selectedRole
};


    await client.setEx(cacheKey, 3600, JSON.stringify(response));
    res.json({ success: true, source: "computed", ...response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const analysis = await AnalyzedProfile.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "No analyzed profile found. Please analyze profile first."
      });
    }

    const improvedProfile = await analyzeProfileAI(
      analysis.profileText,
      analysis.professionalRole
    );

    res.json({
      success: true,
      original: analysis.profileData,
      improved: improvedProfile
    });

  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate suggestions"
    });
  }
};
