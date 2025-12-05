// services/pdfParserService.js
const fs = require("fs");
const pdfParse = require("pdf-parse"); // no .default, just require directly

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer); // works now
  return data.text;
}

module.exports = { parsePDF };
