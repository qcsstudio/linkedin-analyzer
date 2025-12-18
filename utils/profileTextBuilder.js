function buildTextFromProfile(p) {
  let text = "";

  if (p.username) text += `Username: ${p.username}\n`;
  if (p.headline) text += `Headline: ${p.headline}\n`;
  if (p.about) text += `About: ${p.about}\n`;
  if (p.location) text += `Location: ${p.location}\n`;
  if (p.connections) text += `Connections: ${p.connections}\n`;

  if (Array.isArray(p.experience)) {
    text += "\nExperience:\n";
    p.experience.forEach(exp => {
      text += `${exp.title || ""} ${exp.company || ""}\n`;
      if (exp.description) text += `${exp.description}\n`;
    });
  }

  if (Array.isArray(p.education)) {
    text += "\nEducation:\n";
    p.education.forEach(ed => {
      text += `${ed.school || ""} ${ed.degree || ""}\n`;
    });
  }

  if (Array.isArray(p.skills)) {
    text += `\nSkills: ${p.skills.join(", ")}\n`;
  }

  if (Array.isArray(p.activity)) {
    text += "\nActivity:\n";
    p.activity.forEach(a => {
      if (a.text) text += `${a.text}\n`;
    });
  }

  if (p.contact) text += `Contact: ${p.contact}\n`;

  return text;
}

module.exports = { buildTextFromProfile };
