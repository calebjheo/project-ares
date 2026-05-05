require('dotenv').config();
const axios = require('axios');

async function analyzeAltcoinHeatmap(ticker, base64Image) {
    console.log(`[+] Sending ${ticker} screenshot to Gemini 1.5 Pro for analysis...`);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Analyze this liquidation heatmap for ${ticker}. Output ONLY a valid JSON object with a single key: "${ticker}_Kill_Zone" and the exact price target.`
                    },
                    {
                        inline_data: {
                            mime_type: "image/png",
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.1
        }
    };

    try {
        const response = await axios.post(apiUrl, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        let responseText = response.data.candidates[0].content.parts[0].text;
        console.log("Raw Response:", responseText);
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const jsonResult = JSON.parse(responseText);
        console.log(`[+] Gemini Output for ${ticker}:`, jsonResult);
        return jsonResult;
    } catch (error) {
        console.error(`[-] Error analyzing ${ticker} with Gemini:`, error.response ? JSON.stringify(error.response.data) : error.message);
        return null;
    }
}

// 1x1 transparent png
const fs = require('fs');
const mockImage = fs.readFileSync('screenshot.png', 'base64');
analyzeAltcoinHeatmap("AVAX", mockImage);
