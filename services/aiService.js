// Uses OpenAI to produce ready-to-paste sections.
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function analyzeProfileAI(profileText, role) {
const prompt = `
You are an expert LinkedIn coach. The user role is: ${role}. The profile text follows:
\n${profileText}\n
Create JSON with these keys: headline, about, experience, skills, suggestions (array of short tips). Provide text ready to paste into LinkedIn. Keep JSON strictly formatted.
`;


const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [{ role: "user", content: prompt }],
max_tokens: 800,
});


const raw = completion.choices[0].message.content;
try {
return JSON.parse(raw);
} catch (err) {
const match = raw.match(/\{[\s\S]*\}/);
if (!match) throw new Error("Invalid AI response");
return JSON.parse(match[0]);
}
}


module.exports = { analyzeProfileAI };