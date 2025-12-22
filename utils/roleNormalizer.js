function normalizeRole(role) {
  if (!role) return "job_seeker";

  const r = role.toLowerCase();

  if (r.includes("founder") || r.includes("ceo")) return "founder";
  if (r.includes("recruiter") || r.includes("talent")) return "recruiter";
  if (r.includes("sales") || r.includes("sdr") || r.includes("ae")) return "sales";
  if (r.includes("consultant") || r.includes("coach")) return "consultant";

  return "job_seeker";
}
