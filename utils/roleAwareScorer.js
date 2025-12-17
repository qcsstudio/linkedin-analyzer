const { scoreProfile } = require("./scoringEngine");
const { detectProfileType } = require("./profileDetector");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function detectRoleWithAI(text) {
  const prompt = `
Classify the LinkedIn profile into ONE role only:
job_seeker, founder, sales, consultant, recruiter.

Return ONLY the role.

Profile:
"""${text}"""
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  return res.choices[0].message.content.trim().toLowerCase();
}

async function scoreProfileWithRole(text, selectedRole) {
  const baseScore = scoreProfile(text);
  const ruleDetected = detectProfileType(text);
  let aiDetected = ruleDetected;

  // 🔥 Use AI ONLY if mismatch suspected
  if (ruleDetected !== selectedRole) {
    aiDetected = await detectRoleWithAI(text);
  }

  let penalty = 0;

  if (aiDetected !== selectedRole) {
    penalty = 40; // STRONG mismatch
  } else if (ruleDetected !== selectedRole) {
    penalty = 20; // weak mismatch
  }

  const finalScore = Math.max(baseScore - penalty, 0);

  return {
    finalScore,
    baseScore,
    selectedRole,
    detectedRole: aiDetected,
    roleMatch: aiDetected === selectedRole
  };
}

module.exports = { scoreProfileWithRole };
