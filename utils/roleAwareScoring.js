const { scoreProfile } = require("./scoringEngine");
const { detectProfileType } = require("./profileDetector");

function scoreProfileWithRole(text, selectedRole) {
  const baseScore = scoreProfile(text);
  const detectedRole = detectProfileType(text);

  let penalty = 0;

  const HARD_MISMATCH = 30;
  const SOFT_MISMATCH = 15;

  // 🎯 Role-aware penalty logic
  if (selectedRole === "job_seeker") {
    penalty = 0; // neutral role
  } else if (detectedRole === "job_seeker") {
    penalty = SOFT_MISMATCH; // developer choosing sales/founder/etc
  } else if (selectedRole !== detectedRole) {
    penalty = HARD_MISMATCH;
  }

  let finalScore = baseScore - penalty;

  // Clamp 0–100
  if (finalScore < 0) finalScore = 0;
  if (finalScore > 100) finalScore = 100;

  return {
    finalScore,
    baseScore,
    selectedRole,
    detectedRole,
    roleMatch: selectedRole === detectedRole
  };
}

module.exports = { scoreProfileWithRole };
