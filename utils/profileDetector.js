function detectProfileType(text) {
  const t = text.toLowerCase();

  if (t.match(/founder|ceo|startup|co-founder|vision|scaling/)) return "founder";
  if (t.match(/recruiter|hiring|talent|sourcing|interview/)) return "recruiter";
  if (t.match(/sales|sdr|ae|pipeline|revenue|closing|crm/)) return "sales";
  if (t.match(/consultant|coach|advisory|strategy|mentor/)) return "consultant";

  return "job_seeker"; // developer default
}

module.exports = { detectProfileType };
