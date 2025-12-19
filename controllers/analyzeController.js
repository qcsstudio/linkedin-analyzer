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
      potential: `${100 - result.finalScore}%`
    };

    await client.setEx(cacheKey, 3600, JSON.stringify(response));
    res.json({ success: true, source: "computed", ...response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// -------------------------
// 1️⃣ Upload PDF - FREE
// -------------------------
exports.uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const text = await parsePDF(req.file.path);

    res.json({ success: true, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// -------------------------
// 2️⃣ Score Profile - FREE
// -------------------------
exports.getScore = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    const score = scoreProfile(text);

    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// 3️⃣ Get Suggestions - PAID ONLY
// -------------------------


// -------------------------
// Helper: convert JSON profile to text
// -------------------------
function jsonToText(profile) {
  let text = "";
  if (profile.headline) text += profile.headline + "\n";
  if (profile.about) text += profile.about + "\n";
  if (profile.experience) text += profile.experience.join("\n") + "\n";
  if (profile.skills) text += profile.skills.join(", ") + "\n";
  if (profile.education) text += profile.education.join("\n") + "\n";
  if (profile.contact) text += profile.contact + "\n";
  return text;
}

exports.getSuggestions = async (req, res) => {
  try {
    const analysis = await AnalyzedProfile.findOne({
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        message: "No analyzed profile found"
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
