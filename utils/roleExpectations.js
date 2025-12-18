module.exports = {
  job_seeker: {
    required: ["developer", "engineer", "seeking", "open to work"],
    forbidden: ["hiring"],
    penaltyMissing: 15,
    penaltyForbidden: 25
  },

  founder: {
    required: ["founder", "ceo", "startup", "vision", "building"],
    penaltyMissing: 40
  },

  sales: {
    required: ["sales", "pipeline", "revenue", "closing"],
    penaltyMissing: 35
  },

  consultant: {
    required: ["consultant", "advisor", "clients", "strategy"],
    penaltyMissing: 30
  },

  recruiter: {
    required: ["recruiter", "hiring", "talent", "sourcing"],
    penaltyMissing: 35
  }
};
