require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const yahooFinance = require('yahoo-finance2').default;

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

// Function to fetch Corporate Retail Broker Data
async function fetchCorporateData() {
    try {
        console.log('[+] Fetching corporate broker data (COIN, HOOD)...');
        const [coinData, hoodData] = await Promise.all([
            yahooFinance.quote('COIN'),
            yahooFinance.quote('HOOD')
        ]);
        
        return {
            COIN: {
                price: coinData.regularMarketPrice,
                changePercent: coinData.regularMarketChangePercent
            },
            HOOD: {
                price: hoodData.regularMarketPrice,
                changePercent: hoodData.regularMarketChangePercent
            }
        };
    } catch (error) {
        console.error('[-] Error fetching corporate data:', error.message);
        return {
            COIN: { price: '0', changePercent: '0' },
            HOOD: { price: '0', changePercent: '0' }
        };
    }
}

async function scrapeFarsideETF(browser) {
    if (!browser) return { rawText: 'Scrape failed due to Cloudflare.' };
    console.log('[+] Scraping Farside ETF data via Proxy...');
    let page;
    try {
        page = await browser.newPage();
        
        if (process.env.PROXY_API_KEY) {
            await page.authenticate({ username: process.env.PROXY_API_KEY, password: '' });
        }
        
        await page.goto('https://farside.co.uk/?p=997', { waitUntil: 'domcontentloaded', timeout: 20000 });
        const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
        return { rawText: text };
    } catch (error) {
        console.error('[-] Error scraping Farside:', error.message);
        return { rawText: `PROXY ERROR: ${error.message}` };
    } finally {
        if (page) await page.close().catch(() => {});
    }
}

// Function to screenshot Coinglass Liquidation Heatmap using Puppeteer via Proxy
async function takeCoinglassScreenshot(ticker, browser) {
    if (!browser) return 'Scrape failed due to Cloudflare.';
    console.log(`[+] Taking Coinglass screenshot for ${ticker} via Proxy...`);
    let page;
    try {
        page = await browser.newPage();
        
        if (process.env.PROXY_API_KEY) {
            await page.authenticate({ username: process.env.PROXY_API_KEY, password: '' });
        }
        
        const url = `https://www.coinglass.com/pro/liquidation/${ticker}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const screenshotBase64 = await page.screenshot({ encoding: 'base64' });
        return screenshotBase64;
    } catch (error) {
        console.error(`[-] Error scraping Coinglass for ${ticker}:`, error.message);
        return `PROXY ERROR: ${error.message}`;
    } finally {
        if (page) await page.close().catch(() => {});
    }
}

// Function to send data to Gemini 1.5-flash API
async function sendToGemini(payload, lang = 'EN') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const hasFailedScrape = 
        payload.etfFlow.rawText.includes('PROXY ERROR') || 
        payload.etfFlow.rawText.includes('Cloudflare') ||
        payload.etfFlow.rawText.includes('security') ||
        payload.etfFlow.rawText.includes('Just a moment') ||
        payload.screenshots.some(s => s && s.includes('PROXY ERROR'));

    let failureContext = '';
    if (hasFailedScrape) {
        let errorMessage = 'Cloudflare Anti-Bot Protection Blocked the Request';
        if (payload.etfFlow.rawText.includes('PROXY ERROR')) errorMessage = payload.etfFlow.rawText;
        if (payload.screenshots.find(s => s && s.includes('PROXY ERROR'))) errorMessage = payload.screenshots.find(s => s && s.includes('PROXY ERROR'));
        
        failureContext = `The scraper failed to fetch live data with the following error: "${errorMessage}". You MUST STILL OUTPUT VALID JSON. Set the values of "BTC_Kill_Zone", "ETH_Kill_Zone", and "SOL_Kill_Zone" to "RADAR JAMMED - RETRYING". Set "Net_ETF_Flow" to "RADAR JAMMED". Set "Corporate_Sentiment" to "RADAR JAMMED". In the "Actionable_Intel" field, you MUST explain that the radar is jammed because of this error: ${errorMessage}. DO NOT copy the numbers from the example structure. DO NOT hallucinate inflows or outflows. Say explicitly that data is jammed.\n`;
    }
    
    let heatmapParts = [];
    if (payload.screenshots && payload.screenshots.length > 0) {
        payload.screenshots.forEach(s => {
            if (s && !s.includes('PROXY ERROR')) {
                heatmapParts.push({ inline_data: { mime_type: "image/png", data: s } });
            }
        });
    }

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `You are a machine API. You must output ONLY valid JSON. The 'Market_Posture' field MUST be exactly one English word (e.g., AGGRESSIVE, NEUTRAL, DEFENSIVE, DANGER). The 'Actionable_Intel' field MUST include specific ETF inflow/outflow numbers and coin tickers. 
IMPORTANT: The 'Actionable_Intel' field MUST be written in the ${lang} language.

${failureContext}

Here is the EXACT JSON format you must follow:\n` +
                              `{\n` +
                              `"Market_Posture": "DEFENSIVE",\n` +
                              `"Fear_Greed_Score": "78",\n` +
                              `"Corporate_Sentiment": "Coinbase and Robinhood are bleeding down 4%, indicating total retail exhaustion.",\n` +
                              `"Net_ETF_Flow": "+$285M",\n` +
                              `"Actionable_Intel": "[Translate this intel into ${lang}]: BTC ETFs saw $335M inflows led by BlackRock, while ETH ETFs saw $50M outflows. Retail sentiment is euphoric at 78. Prepare for a liquidity flush.",\n` +
                              `"BTC_Kill_Zone": "BTC: $74,800",\n` +
                              `"ETH_Kill_Zone": "ETH: $2,150",\n` +
                              `"SOL_Kill_Zone": "SOL: $71.50"\n` +
                              `}\n\n` +
                              `Please analyze the following crypto risk-management data and format your response into the exact JSON structure above. Use the following live anchor prices:\n` +
                              `BTC Price: $${payload.cryptoData.btcPrice}\n` +
                              `ETH Price: $${payload.cryptoData.ethPrice}\n` +
                              `SOL Price: $${payload.cryptoData.solPrice}\n` +
                              `Fear & Greed Index: ${payload.cryptoData.fearAndGreed.value} (${payload.cryptoData.fearAndGreed.classification})\n` +
                              `COIN Stock: $${payload.corpData.COIN.price} (${payload.corpData.COIN.changePercent}%)\n` +
                              `HOOD Stock: $${payload.corpData.HOOD.price} (${payload.corpData.HOOD.changePercent}%)\n` +
                              `Raw Farside ETF Data:\n${payload.etfFlow.rawText}\n\n` +
                              `Analyze the attached Coinglass liquidation heatmaps (if provided) and find the heaviest liquidation clusters STRICTLY BELOW the live anchor prices.`
                    },
                    ...heatmapParts
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
        console.error('Error sending data to Gemini API:', error.response ? JSON.stringify(error.response.data) : error.message);
        throw error;
    }
}

// Express Server Setup
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rate Limiting
const riskLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Pro upgrade required.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token. Please sign in again.' });
        }
        req.user = user;
        next();
    });
};

// Stripe Session Verification & JWT Generation
app.get('/api/verify-session', async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) {
        return res.status(400).json({ error: 'Session ID is required.' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
            const token = jwt.sign({ proStatus: 'active', sessionId: session_id }, secret, { expiresIn: '7d' });
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Payment not completed.' });
        }
    } catch (error) {
        console.error('Error verifying Stripe session:', error);
        return res.status(500).json({ error: 'Internal server error during verification.' });
    }
});

// Cache Implementation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let sharedPayloadCache = { payload: null, timestamp: 0 };
let finalResponseCache = {};
let isSweeping = false;

// Background Cron Engine
async function runBackgroundSweep() {
    if (isSweeping) return;
    isSweeping = true;
    console.log('[+] Starting background data sweep...');
    
    let browser;
    try {
        const proxyUrl = process.env.PROXY_URL || 'http://proxy.scrapingbee.com:8886';
        const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
        if (process.env.PROXY_API_KEY) {
            args.push(`--proxy-server=${proxyUrl}`);
        }

        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: args,
                ignoreHTTPSErrors: true
            });
        } catch (e) {
            console.error("[-] Failed to launch Puppeteer completely:", e.message);
        }
        
        const [cryptoData, etfFlow, btcScreenshot, ethScreenshot, solScreenshot, corpData] = await Promise.all([
            fetchCryptoData(),
            scrapeFarsideETF(browser),
            takeCoinglassScreenshot('BTC', browser),
            takeCoinglassScreenshot('ETH', browser),
            takeCoinglassScreenshot('SOL', browser),
            fetchCorporateData()
        ]);
        
        if (browser) await browser.close().catch(() => {});
        
        const payload = {
            cryptoData,
            etfFlow,
            screenshots: [btcScreenshot, ethScreenshot, solScreenshot],
            corpData
        };
        
        sharedPayloadCache = { payload, timestamp: Date.now() };
        finalResponseCache = {}; // Clear translation cache
        console.log('[+] Background sweep completed and cached.');
    } catch (e) {
        console.error('[-] Error in background sweep:', e);
        if (browser) await browser.close().catch(() => {});
    } finally {
        isSweeping = false;
    }
}

// Start sweeping immediately, then every 5 minutes
runBackgroundSweep();
setInterval(runBackgroundSweep, 300000);

app.get('/api/risk', riskLimiter, async (req, res) => {
    const lang = req.query.lang || 'EN';
    
    const now = Date.now();
    
    // Check if we have a fully translated, valid response cache
    if (finalResponseCache[lang] && (now - finalResponseCache[lang].timestamp < CACHE_DURATION)) {
        console.log(`[CACHE HIT] Returning live dashboard data for ${lang} from memory.`);
        return res.json(finalResponseCache[lang].data);
    }
    
    // If we have a payload but no translation yet, generate translation instantly
    if (sharedPayloadCache.payload) {
        try {
            console.log(`[+] Translating payload instantly for ${lang}`);
            const cachedResult = await sendToGemini(sharedPayloadCache.payload, lang);
            
            // Validate JSON
            let finalJson;
            try {
                let responseText = cachedResult.candidates[0].content.parts[0].text;
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                finalJson = JSON.parse(responseText);
            } catch(e) {
                finalJson = {
                    "Market_Posture": "UNKNOWN",
                    "Fear_Greed_Score": sharedPayloadCache.payload.cryptoData.fearAndGreed.value || "50",
                    "Corporate_Sentiment": "RADAR JAMMED",
                    "Net_ETF_Flow": "RADAR JAMMED",
                    "Actionable_Intel": "RADAR JAMMED - System is attempting to bypass Cloudflare constraints. Retrying secure connection...",
                    "BTC_Kill_Zone": "RADAR JAMMED - RETRYING",
                    "ETH_Kill_Zone": "RADAR JAMMED - RETRYING",
                    "SOL_Kill_Zone": "RADAR JAMMED - RETRYING"
                };
            }
            
            finalResponseCache[lang] = {
                data: finalJson,
                timestamp: now
            };
            
            return res.json(finalJson);
        } catch(e) {
            console.error(e);
            return res.status(500).json({ error: 'Failed to process risk assessment' });
        }
    } else {
        console.log('[-] Serving booting fallback payload');
        return res.json({
            "Market_Posture": "UNKNOWN",
            "Fear_Greed_Score": "50",
            "Corporate_Sentiment": "SYSTEM BOOTING",
            "Net_ETF_Flow": "SYSTEM BOOTING",
            "Actionable_Intel": "The Project ARES tactical servers are currently booting up and acquiring initial radar sweeps. Please hold the line and refresh in 60 seconds.",
            "BTC_Kill_Zone": "ACQUIRING...",
            "ETH_Kill_Zone": "ACQUIRING...",
            "SOL_Kill_Zone": "ACQUIRING..."
        });
    }
});

// Altcoin Radar Logic
async function fetchAltcoinPrice(ticker) {
    try {
        const cgConfig = process.env.COINGECKO_API_KEY ? {
            headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
        } : {};
        
        const searchRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${ticker}`, cgConfig);
        if (!searchRes.data.coins || searchRes.data.coins.length === 0) return null;
        
        const exactMatch = searchRes.data.coins.find(c => c.symbol.toLowerCase() === ticker.toLowerCase());
        const coinId = exactMatch ? exactMatch.id : searchRes.data.coins[0].id;
        
        const priceRes = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`, cgConfig);
        return priceRes.data[coinId]?.usd || null;
    } catch (error) {
        console.error(`Error fetching live price for ${ticker}:`, error.message);
        return null;
    }
}

async function analyzeAltcoinHeatmap(ticker) {
    console.log(`[+] Asking Gemini 2.5 Flash to estimate Kill Zone for ${ticker}...`);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const currentPriceRaw = await fetchAltcoinPrice(ticker);
    const currentPrice = currentPriceRaw ? `$${currentPriceRaw}` : 'unknown';

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `You are a quantitative risk AI. The current live spot price of ${ticker} is ${currentPrice}. Analyze the attached Coinglass liquidation heatmap screenshot. You MUST find the heaviest liquidation cluster STRICTLY BELOW the current price of ${currentPrice}. Do not hallucinate. Do not output a target higher than the current price. Output ONLY valid JSON in this format: { "Kill_Zone": "[Price]", "Threat_Level": "[HIGH, ELEVATED, or STABLE]" }`
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
        const jsonResult = await analyzeAltcoinHeatmap(ticker);
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
    fetchCorporateData,
    scrapeFarsideETF,
    takeCoinglassScreenshot,
    sendToGemini,
    app
};
