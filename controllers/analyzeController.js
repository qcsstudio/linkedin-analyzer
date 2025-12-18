const { parsePDF } = require("../services/pdfParserService");
const { scoreProfile } = require("../utils/scoringEngine");
const { analyzeProfileAI } = require("../services/aiService");
const { normalizeRole } = require("../utils/roleNormalizer");
const { scoreProfileWithRole } = require("../utils/roleAwareScorer");
const { buildTextFromProfile } = require("../utils/profileTextBuilder");

exports.uploadProfileData = async (req, res) => {
  try {
    const profile = req.body;

    if (!profile || Object.keys(profile).length === 0) {
      return res.status(400).json({ message: "Profile data required" });
    }

    const text = buildTextFromProfile(profile);
    const selectedRole = normalizeRole(profile.role);

    const result = scoreProfileWithRole(text.toLowerCase(), selectedRole);

    res.json({
      success: true,
      score: `${result.finalScore}%`,
      baseScore: `${result.baseScore}%`,
      strength:
        result.finalScore < 40
          ? "weak"
          : result.finalScore < 70
          ? "average"
          : "strong",
      potential: `${100 - result.finalScore}%`,
      analysis: {
        roleSelected: result.selectedRole,
        roleDetected: result.detectedRole,
        roleMatch: result.roleMatch,
        penalties: result.penalties,
        breakdown: result.breakdown
      }
    });

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

// exports.uploadProfileData = async (req, res) => {
//   try {
//     const p = req.body;

//     console.log("Received profile data:", p);

//     if (!p || Object.keys(p).length === 0) {
//       return res.status(400).json({ message: "Profile data required" });
//     }

//     // -------------------------
//     // Convert new structured JSON -> plain text
//     // -------------------------
//     let text = "";

//     if (p.username) text += `Username: ${p.username}\n`;
//     if (p.headline) text += `Headline: ${p.headline}\n`;
//     if (p.about) text += `About: ${p.about}\n`;
//     if (p.location) text += `Location: ${p.location}\n`;
//     if (p.connections) text += `Connections: ${p.connections}\n`;

//     // Experience (object array)
//     if (p.experience && Array.isArray(p.experience)) {
//       text += "\nExperience:\n";
//       p.experience.forEach(exp => {
//         if (exp.title) text += `${exp.title} at ${exp.company || ""}\n`;
//         if (exp.duration) text += `Duration: ${exp.duration}\n`;
//         if (exp.location) text += `Location: ${exp.location}\n`;
//         if (exp.description) text += `Description: ${exp.description}\n\n`;
//       });
//     }

//     // Education (object array)
//     if (p.education && Array.isArray(p.education)) {
//       text += "\nEducation:\n";
//       p.education.forEach(ed => {
//         if (ed.school) text += `${ed.school} - ${ed.degree || ""}\n`;
//         if (ed.duration) text += `Duration: ${ed.duration}\n\n`;
//       });
//     }

//     // Skills (array)
//     if (p.skills) {
//       text += `Skills: ${p.skills.join(", ")}\n`;
//     }

//     // Activity (object array)
//     if (p.activity && Array.isArray(p.activity)) {
//       text += "\nActivity:\n";
//       p.activity.forEach(a => {
//         if (a.type) text += `Type: ${a.type}\n`;
//         if (a.text) text += `Text: ${a.text}\n`;
//         if (a.timestamp) text += `Time: ${a.timestamp}\n\n`;
//       });
//     }

//     if (p.contact) text += `Contact: ${p.contact}\n`;

//     // -------------------------
//     // Score the profile
//     // -------------------------
   
// const selectedRole = normalizeRole(p.role);

// const result = await scoreProfileWithRole(text, selectedRole);

// let message = "";
// if (result.finalScore < 40) message = "Your profile is weak";
// else if (result.finalScore < 70) message = "Your profile is intermediate";
// else message = "Your profile is strong";

// res.json({
//   success: true,
//   score: result.finalScore + "%",
//   baseScore: result.baseScore + "%",
//   detectedRole: result.detectedRole,
//   selectedRole: result.selectedRole,
//   roleMatch: result.roleMatch,
//   potential: 100 - result.finalScore + "%",
//   message
// });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



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
    // 🔐 Payment check
    if (!req.user?.hasPaid) {
      return res.status(403).json({
        message: "Payment required to access LinkedIn Suggestions",
      });
    }

    const profileData = req.body; // SAME AS SCORING API

    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({ message: "Profile data required" });
    }

    // -----------------------------------
    // Convert JSON → text (same logic as scoring API)
    // -----------------------------------
    let text = "";

    if (profileData.username) text += `Username: ${profileData.username}\n`;
    if (profileData.headline) text += `Headline: ${profileData.headline}\n`;
    if (profileData.about) text += `About: ${profileData.about}\n`;
    if (profileData.location) text += `Location: ${profileData.location}\n`;
    if (profileData.connections) text += `Connections: ${profileData.connections}\n`;

    // Experience
    if (profileData.experience && Array.isArray(profileData.experience)) {
      text += "\nExperience:\n";
      profileData.experience.forEach(exp => {
        if (exp.title) text += `${exp.title} at ${exp.company || ""}\n`;
        if (exp.duration) text += `Duration: ${exp.duration}\n`;
        if (exp.location) text += `Location: ${exp.location}\n`;
        if (exp.description) text += `Description: ${exp.description}\n\n`;
      });
    }

    // Education
    if (profileData.education && Array.isArray(profileData.education)) {
      text += "\nEducation:\n";
      profileData.education.forEach(ed => {
        if (ed.school) text += `${ed.school} - ${ed.degree || ""}\n`;
        if (ed.duration) text += `Duration: ${ed.duration}\n\n`;
      });
    }

    // Skills
    if (profileData.skills) {
      text += `Skills: ${profileData.skills.join(", ")}\n`;
    }

    // Activity
    if (profileData.activity && Array.isArray(profileData.activity)) {
      text += "\nActivity:\n";
      profileData.activity.forEach(a => {
        if (a.type) text += `Type: ${a.type}\n`;
        if (a.text) text += `Text: ${a.text}\n`;
        if (a.timestamp) text += `Time: ${a.timestamp}\n\n`;
      });
    }

    if (profileData.contact) text += `Contact: ${profileData.contact}\n`;

    // If text is still empty (should never happen)
    if (!text.trim()) {
      return res.status(400).json({ message: "Text or profile data required" });
    }

    // -----------------------------------
    // AI Improve Profile
    // -----------------------------------
    const role = profileData.role || "job_seeker";

    const improvedProfile = await analyzeProfileAI(text, role);

    res.json({
      success: true,
      original: profileData,  // SAME JSON you sent
      improved: improvedProfile
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
