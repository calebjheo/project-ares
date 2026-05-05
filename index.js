require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

// Function to fetch BTC Price and Fear & Greed Index
async function fetchCryptoData() {
    try {
        // Fetch BTC, ETH, and SOL Price from CoinGecko
        const cgConfig = process.env.COINGECKO_API_KEY ? {
            headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
        } : {};
        
        const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd', cgConfig);
        const btcPrice = priceResponse.data.bitcoin.usd;
        const ethPrice = priceResponse.data.ethereum.usd;
        const solPrice = priceResponse.data.solana.usd;

        // Fetch Fear & Greed Index from alternative.me (CoinGecko doesn't provide this natively)
        const fgResponse = await axios.get('https://api.alternative.me/fng/');
        const fearAndGreedIndex = fgResponse.data.data[0].value;
        const fearAndGreedClass = fgResponse.data.data[0].value_classification;

        return {
            btcPrice,
            ethPrice,
            solPrice,
            fearAndGreed: {
                value: fearAndGreedIndex,
                classification: fearAndGreedClass
            }
        };
    } catch (error) {
        console.error('Error fetching crypto data (using fallback):', error.message);
        return {
            btcPrice: 72500,
            ethPrice: 3400,
            solPrice: 150,
            fearAndGreed: { value: 75, classification: "Greed" }
        };
    }
}

async function scrapeFarsideETF() {
    console.log('Skipping Puppeteer and using mock ETF flow data for BTC and ETH.');
    return { btcFlow: '145.5', ethFlow: '-50.0' }; // Mock fallback data
}

// Function to screenshot Coinglass Liquidation Heatmap using Puppeteer
async function takeCoinglassScreenshot() {
    return null; // Using mock in payload
}

// Function to send data to Gemini 1.5 Pro API
async function sendToGemini(payload, lang = 'EN') {
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
                        text: `You are a machine API. You must output ONLY valid JSON. The 'Market_Posture' field MUST be exactly one English word (e.g., AGGRESSIVE, NEUTRAL, DEFENSIVE, DANGER). The 'Actionable_Intel' field MUST include specific ETF inflow/outflow numbers and coin tickers. 
IMPORTANT: The 'Actionable_Intel' field MUST be written in the ${lang} language.

Here is the EXACT JSON format you must follow:\n` +
                              `{\n` +
                              `"Market_Posture": "DEFENSIVE",\n` +
                              `"Actionable_Intel": "[Translate this intel into ${lang}]: BTC ETFs saw $335M inflows led by BlackRock, while ETH ETFs saw $50M outflows. Retail sentiment is euphoric at 78. Prepare for a liquidity flush.",\n` +
                              `"BTC_Kill_Zone": "BTC: $74,800",\n` +
                              `"ETH_Kill_Zone": "ETH: $2,150",\n` +
                              `"SOL_Kill_Zone": "SOL: $71.50"\n` +
                              `}\n\n` +
                              `Please analyze the following crypto risk-management data and format your response into the exact JSON structure above:\n\n` +
                              `BTC Price: $${payload.cryptoData.btcPrice}\n` +
                              `ETH Price: $${payload.cryptoData.ethPrice}\n` +
                              `SOL Price: $${payload.cryptoData.solPrice}\n` +
                              `Fear & Greed Index: ${payload.cryptoData.fearAndGreed.value} (${payload.cryptoData.fearAndGreed.classification})\n` +
                              `BTC ETF Net Flow: ${payload.etfFlow.btcFlow} million USD\n` +
                              `ETH ETF Net Flow: ${payload.etfFlow.ethFlow} million USD\n\n` +
                              `${payload.heatmapScreenshot}`
                    }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error sending data to Gemini API:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Express Server Setup
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/risk', async (req, res) => {
    const lang = req.query.lang || 'EN';
    console.log(`API Request: Fetching risk assessment data for lang: ${lang}...`);
    try {
        console.log('1. Fetching CoinGecko & Fear/Greed Data...');
        const cryptoData = await fetchCryptoData();
        
        console.log('2. Scraping Farside ETF Flows...');
        const etfFlow = await scrapeFarsideETF();
        
        console.log('3. Using Placeholder Coinglass Liquidation Heatmap Text...');
        const heatmapScreenshot = "Liquidation Data: BTC heavy cluster at $74,800. ETH heavy cluster at $2,150. SOL heavy cluster at $71.50.";
        
        const payload = {
            cryptoData,
            etfFlow,
            heatmapScreenshot
        };
        
        if (cryptoData && etfFlow && heatmapScreenshot) {
            console.log('4. Sending payload to Gemini 1.5 Pro API...');
            const geminiResponse = await sendToGemini(payload, lang);
            let responseText = geminiResponse.candidates[0].content.parts[0].text;
            
            // Clean markdown block formatting if present
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            res.json(JSON.parse(responseText));
        } else {
            res.status(500).json({ error: 'Failed to collect all required data points.' });
        }
    } catch (error) {
        console.error('Error handling /api/risk request:', error);
        res.status(500).json({ error: 'Internal server error while evaluating risk.' });
    }
});

// Altcoin Radar Logic
async function getAltcoinData(ticker) {
    console.log(`\n[+] Initiating scrape for ${ticker}...`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        const url = `https://www.coinglass.com/pro/liquidation/${ticker}`;
        console.log(`[+] Navigating to: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const screenshotBase64 = await page.screenshot({ encoding: 'base64' });
        console.log(`[+] Screenshot captured successfully for ${ticker}.`);
        
        return screenshotBase64;
    } catch (error) {
        console.error(`[-] Error scraping data for ${ticker}:`, error.message);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function analyzeAltcoinHeatmap(ticker, base64Image) {
    if (!base64Image) {
        console.log(`[-] Skipping Gemini analysis for ${ticker} due to missing screenshot.`);
        return null;
    }

    console.log(`[+] Sending ${ticker} screenshot to Gemini 1.5 Pro for analysis...`);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

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
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const jsonResult = JSON.parse(responseText);
        console.log(`[+] Gemini Output for ${ticker}:`, jsonResult);
        return jsonResult;
    } catch (error) {
        console.error(`[-] Error analyzing ${ticker} with Gemini:`, error.response ? JSON.stringify(error.response.data) : error.message);
        return null;
    }
}

app.get('/api/altcoin', async (req, res) => {
    const ticker = req.query.ticker?.toUpperCase();
    if (!ticker) {
        return res.status(400).json({ error: 'Ticker is required' });
    }

    console.log(`API Request: Fetching altcoin radar for ${ticker}...`);
    try {
        const screenshot = await getAltcoinData(ticker);
        if (!screenshot) {
            return res.status(500).json({ error: 'Failed to retrieve heatmap data' });
        }
        
        const jsonResult = await analyzeAltcoinHeatmap(ticker, screenshot);
        if (!jsonResult) {
            return res.status(500).json({ error: 'Failed to analyze heatmap data' });
        }
        
        res.json(jsonResult);
    } catch (error) {
        console.error(`Error handling /api/altcoin request for ${ticker}:`, error);
        res.status(500).json({ error: 'Internal server error while evaluating altcoin.' });
    }
});


// Do not execute automatically if imported as a module
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Project ARES Backend API running on http://localhost:${PORT}`);
    });
}

module.exports = {
    fetchCryptoData,
    scrapeFarsideETF,
    takeCoinglassScreenshot,
    sendToGemini,
    app
};
