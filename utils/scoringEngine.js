// utils/scoringEngine.js

function scoreProfile(text) {
  if (!text) return 0;

  const t = text.toLowerCase();
  let score = 0;

  // -----------------------------
  // 1. Length score (max 20)
  // -----------------------------
  const length = t.length;
  if (length > 2500) {
    score += 20;
  } else {
    score += Math.round(Math.min(20, (length / 2500) * 20));
  }

  // -----------------------------
  // 2. Headline presence (10)
  // -----------------------------
  if (/(headline|title|profile headline)/.test(t)) {
    score += 10;
  }

  // -----------------------------
  // 3. About/Summary (15)
  // -----------------------------
  if (/(about|summary|professional summary|bio)/.test(t)) {
    score += 15;
  }

  // -----------------------------
  // 4. Experience score (max 20)
  // -----------------------------
  const expKeywords = [
    "experience",
    "managed",
    "led",
    "developed",
    "achieved",
    "worked as",
    "responsible for"
  ];

  const expHits = expKeywords.reduce(
    (acc, kw) => acc + (t.includes(kw) ? 1 : 0),
    0
  );

  score += Math.min(20, expHits * 4);

  // -----------------------------
  // 5. Skills section (15)
  // -----------------------------
  if (/(skills|technologies|tools|proficiencies)/.test(t)) {
    score += 15;
  }

  // -----------------------------
  // 6. Education (5)
  // -----------------------------
  if (/(university|college|bachelor|master|degree|phd)/.test(t)) {
    score += 5;
  }

  // -----------------------------
  // 7. Contact / CTA (5)
  // -----------------------------
  if (/(contact|connect|email|phone|linkedin\.com)/.test(t)) {
    score += 5;
  }

  // -----------------------------
  // Final cap between 0–100
  // -----------------------------
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return score;
}

module.exports = { scoreProfile };
