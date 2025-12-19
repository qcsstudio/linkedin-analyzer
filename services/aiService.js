const OpenAI = require("openai");
const { buildRolePrompt } = require("../utils/rolePromptBuilder");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No valid JSON found in OpenAI response");
  }
  return JSON.parse(match[0]);
}

exports.analyzeProfileAI = async (profileText, role) => {
  const roleInstruction = buildRolePrompt(role);

  const prompt = `
You are a LinkedIn profile optimization expert.

ROLE: ${role}

${roleInstruction}

TASK:
- Improve headline
- Rewrite About section professionally
- Rewrite Experience with impact & metrics
- Improve Skills (remove weak, add strong)
- Keep everything truthful
- DO NOT invent fake experience

IMPORTANT:
- Return ONLY raw JSON
- DO NOT wrap in markdown
- DO NOT use \`\`\`

JSON FORMAT:
{
  "headline": "",
  "about": "",
  "experience": [
    {
      "title": "",
      "company": "",
      "description": ""
    }
  ],
  "skills": [],
  "summary": []
}

PROFILE DATA:
"""
${profileText}
"""
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });

  const raw = response.choices[0].message.content;

  return extractJSON(raw);
};
