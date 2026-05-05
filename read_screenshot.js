require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function readScreenshot() {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const base64Image = fs.readFileSync('screenshot.png', 'base64');

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    { text: `What is the main title or content of this page? Does it mention AVAX or BTC? What does the page look like?` },
                    { inline_data: { mime_type: "image/png", data: base64Image } }
                ]
            }
        ]
    };

    const response = await axios.post(apiUrl, requestBody, { headers: { 'Content-Type': 'application/json' } });
    console.log(response.data.candidates[0].content.parts[0].text);
}

readScreenshot();
