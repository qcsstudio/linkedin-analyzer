const { scoreProfile } = require("./scoringEngine");
const { detectProfileType } = require("./profileDetector");
const roleRules = require("./roleExpectations");

function keywordMatchCount(text, keywords = []) {
  return keywords.filter(k => text.includes(k)).length;
}

function scoreProfileWithRole(text, selectedRole) {
  const base = scoreProfile(text);
  const { detectedRole } = detectProfileType(text);

  let finalScore = base.total;
  const penalties = [];

  const rules = roleRules[selectedRole];

  if (rules?.required) {
    const matchCount = keywordMatchCount(text, rules.required);
    if (matchCount === 0) {
      finalScore -= rules.penaltyMissing;
      penalties.push("missing_role_signals");
    } else if (matchCount === 1) {
      finalScore -= Math.round(rules.penaltyMissing / 2);
      penalties.push("weak_role_signals");
    }
  }

  if (rules?.forbidden && keywordMatchCount(text, rules.forbidden) > 0) {
    finalScore -= rules.penaltyForbidden;
    penalties.push("conflicting_role_signals");
  }

  const softSimilarity = {
    founder: ["job_seeker"],
    consultant: ["job_seeker"],
    job_seeker: ["founder", "consultant"]
  };

  if (detectedRole !== selectedRole) {
    if (softSimilarity[selectedRole]?.includes(detectedRole)) {
      finalScore -= 8;
      penalties.push("soft_role_mismatch");
    } else {
      finalScore -= 20;
      penalties.push("role_mismatch");
    }
  }

  finalScore = Math.max(finalScore, 0);

  return {
    baseScore: base.total,
    finalScore,
    selectedRole,
    detectedRole,
    roleMatch: detectedRole === selectedRole,
    penalties,
    breakdown: base.breakdown
  };
}

module.exports = { scoreProfileWithRole };
