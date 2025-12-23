function buildTextFromImprovedProfile(p) {
  let text = "";

  if (p.headline) text += `Headline: ${p.headline}\n`;
  if (p.about) text += `About: ${p.about}\n`;

  if (Array.isArray(p.experience)) {
    text += "\nExperience:\n";
    p.experience.forEach(exp => {
      text += `${exp.title || ""} ${exp.company || ""}\n`;
      if (exp.description) text += `${exp.description}\n`;
    });
  }

  if (Array.isArray(p.skills)) {
    text += `\nSkills: ${p.skills.join(", ")}\n`;
  }

  return text;
}

module.exports = { buildTextFromImprovedProfile };
