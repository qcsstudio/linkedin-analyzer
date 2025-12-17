function scoreProfile(text) {
  if (!text) return 0;
  const t = text.toLowerCase();
  let score = 0;

  const length = t.length;
  score += Math.min(20, Math.round((length / 2500) * 20));

  if (/(headline)/.test(t)) score += 10;
  if (/(about|summary|bio)/.test(t)) score += 15;

  const expKeywords = ["developed", "managed", "led", "worked", "built"];
  score += Math.min(
    20,
    expKeywords.filter(k => t.includes(k)).length * 4
  );

  if (/(skills|tools|technologies)/.test(t)) score += 15;
  if (/(degree|university|college)/.test(t)) score += 5;
  if (/(email|contact|linkedin)/.test(t)) score += 5;

  return Math.min(score, 100);
}

module.exports = { scoreProfile };
