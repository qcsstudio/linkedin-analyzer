function buildRolePrompt(role) {
  switch (role) {
    case "founder":
      return `
Focus on:
- Vision, leadership, startups, growth
- Impact, metrics, ownership
- Avoid job-seeker tone
`;
    case "sales":
      return `
Focus on:
- Revenue, pipeline, quotas, closing
- Numbers, achievements, CRM
- Strong persuasive language
`;
    case "consultant":
      return `
Focus on:
- Clients, strategy, results
- Authority and expertise
`;
    case "recruiter":
      return `
Focus on:
- Hiring, talent sourcing, employer branding
`;
    case "jobseeker":
      return `
Focus on:
- Skills, projects, impact
- Job-ready professional tone
- Optimize for recruiters
`;
    default:
      return "";
  }
}

module.exports = { buildRolePrompt };
