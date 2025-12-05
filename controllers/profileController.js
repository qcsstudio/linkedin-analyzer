// controllers/profileController.js
const { parsePDF } = require("../services/pdfParserService");
const { analyzeProfileAI } = require("../services/aiService");
const { scoreProfile } = require("../utils/scoringEngine");

// Score text for free preview (0-100)
exports.getScore = (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text required" });

    const wordCount = text.split(/\s+/).length;
    const score = Math.min(100, Math.floor(wordCount / 5));

    res.json({ success: true, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Paid AI action_tips (requires JWT + payment)
exports.getSuggestions = async (req, res) => {
  try {
    const { text, role } = req.body;
    if (!text) return res.status(400).json({ message: "text required" });

    const roleType = role || "job_seeker";
    const action_tips = await analyzeProfileAI(text, roleType);

    res.json({ success: true, action_tips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
