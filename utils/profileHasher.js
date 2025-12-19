const crypto = require("crypto");

function hashProfile(profile) {
  const cleanProfile = { ...profile };
  delete cleanProfile.role; // role should NOT affect hash

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(cleanProfile))
    .digest("hex");
}

module.exports = { hashProfile };
