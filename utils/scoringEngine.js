function scoreProfile(text) {
  let score = 0;
  const breakdown = {};

  const lengthScore = Math.min(20, Math.round((text.length / 2500) * 20));
  score += lengthScore;
  breakdown.length = lengthScore;

  const headlineScore = text.includes("headline") ? 10 : 0;
  score += headlineScore;
  breakdown.headline = headlineScore;

  const aboutScore = /(about|summary|bio)/.test(text) ? 15 : 0;
  score += aboutScore;
  breakdown.about = aboutScore;

  const expKeywords = ["built", "led", "managed", "developed", "worked"];
  const expScore = Math.min(
    20,
    expKeywords.filter(k => text.includes(k)).length * 4
  );
  score += expScore;
  breakdown.experience = expScore;

  const skillsScore = text.includes("skills") ? 15 : 0;
  score += skillsScore;
  breakdown.skills = skillsScore;

  const educationScore = /(university|college|degree)/.test(text) ? 5 : 0;
  score += educationScore;
  breakdown.education = educationScore;

  const contactScore = /(contact|email|linkedin)/.test(text) ? 5 : 0;
  score += contactScore;
  breakdown.contact = contactScore;

  return {
    total: Math.min(score, 100),
    breakdown
  };
}

module.exports = { scoreProfile };
