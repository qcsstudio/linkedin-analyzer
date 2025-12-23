function boostSection(value, max, boostPercent = 0.4) {
  const boosted = Math.round(value + (max - value) * boostPercent);
  return Math.min(boosted, max);
}

exports.buildImprovedScore = (original) => {
  const improvedSections = {
    headline: boostSection(original.headline, 20),
    about: boostSection(original.about, 25),
    experience: boostSection(original.experience, 20),
    skills: boostSection(original.skills, 20),
    education: original.education, // keep same
    contact: original.contact,     // keep same
    length: boostSection(original.length, 10)
  };

  const total =
    improvedSections.headline +
    improvedSections.about +
    improvedSections.experience +
    improvedSections.skills +
    improvedSections.education +
    improvedSections.contact +
    improvedSections.length;

  return {
    finalScore: Math.min(total, 85), // cap at 85%
    sections: improvedSections
  };
};
