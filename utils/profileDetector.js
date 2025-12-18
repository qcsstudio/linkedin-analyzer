function detectProfileType(text) {
  const scores = {
    founder: 0,
    recruiter: 0,
    sales: 0,
    consultant: 0,
    job_seeker: 0
  };

  if (/(founder|co-founder|ceo|startup|vision)/.test(text)) scores.founder += 3;
  if (/(hiring|recruiter|talent|sourcing)/.test(text)) scores.recruiter += 3;
  if (/(sales|pipeline|revenue|closing|crm)/.test(text)) scores.sales += 3;
  if (/(consultant|coach|advisor|clients|strategy)/.test(text)) scores.consultant += 3;
  if (/(developer|engineer|react|node|javascript|software)/.test(text)) scores.job_seeker += 3;

  const detectedRole = Object.keys(scores)
    .sort((a, b) => scores[b] - scores[a])[0];

  return { detectedRole, scores };
}

module.exports = { detectProfileType };
