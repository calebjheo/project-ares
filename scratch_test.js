require('dotenv').config({ path: 'c:\\Users\\Admin\\OneDrive\\Desktop\\Caleb\\Project ARES\\.env' });
const axios = require('axios');

async function testGeminiSuccess() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("NO API KEY FOUND IN .ENV");
        return;
    }
    console.log("Using API Key:", apiKey.substring(0, 10) + "...");
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: "Respond with exactly one word: SECURE" }] }]
    };

    try {
        const response = await axios.post(apiUrl, requestBody, { headers: { 'Content-Type': 'application/json' } });
        console.log("SUCCESS:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("ERROR:", JSON.stringify(error.response ? error.response.data : error.message, null, 2));
    }
}

testGeminiSuccess();
