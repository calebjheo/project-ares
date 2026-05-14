const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  const transPath = path.join(__dirname, '../frontend/src/contexts/translations.js');
  let raw = fs.readFileSync(transPath, 'utf-8');
  raw = raw.replace('export const translations = ', '').replace(/;?\n*$/, '');
  const translations = JSON.parse(raw);

  const enTranslations = translations['EN'];

  const prompt = `Translate the following English JSON object into Ukrainian. 
Ensure trading and crypto terms (like Kill Zones, Spot ETF, Market Maker, Liquidity, Divergence, Exit Liquidity) are translated accurately for native crypto traders in that language. 
Return ONLY a valid JSON object. Do NOT wrap in markdown \`\`\`json blocks.
English JSON:
${JSON.stringify(enTranslations, null, 2)}`;

  console.log('Fetching UK...');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text.trim();
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json\n?/, '');
    if (text.endsWith('\`\`\`')) text = text.replace(/\n?\`\`\`$/, '');
    
    translations['UK'] = JSON.parse(text);
    console.log('Success for UK!');
    
    fs.writeFileSync(transPath, `export const translations = ${JSON.stringify(translations, null, 2)};\n`);
    console.log('Wrote translations.js');
  } catch (err) {
    console.error(err);
  }
}
run();
