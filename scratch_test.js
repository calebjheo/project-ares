const axios = require('axios');

async function testGemini() {
    const apiKey = 'AIzaSyBzl873sSHaWL5tLTPkolaleRL-qUbLFhM';
    console.log("Using API Key:", apiKey.substring(0, 10) + "...");
    
    // Testing gemini-1.5-flash
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{ role: 'user', parts: [{ text: "Respond with exactly one word: YES" }] }]
    };

    try {
        const response = await axios.post(apiUrl, requestBody, { headers: { 'Content-Type': 'application/json' } });
        console.log("SUCCESS:", response.data);
    } catch (error) {
        console.error("ERROR STATUS:", error.response ? error.response.status : error.message);
        console.error("ERROR DATA:", error.response ? error.response.data : error.message);
    }
}

testGemini();
