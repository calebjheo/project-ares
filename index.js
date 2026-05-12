// Trigger Render rebuild
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const { HttpsProxyAgent } = require('https-proxy-agent');
const WebSocket = require('ws');
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
        console.log('[+] Fetching corporate broker data (COIN, HOOD) via ScrapingBee...');
        if (!process.env.PROXY_API_KEY && process.env.NODE_ENV === 'production') return null;

        const fetchStock = async (ticker) => {
            // Use fallback if no proxy key
            if (!process.env.PROXY_API_KEY) {
                return { price: "200", changePercent: "0" };
            }
            const url = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`);
            const proxyApi = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.PROXY_API_KEY}&url=${url}`;
            const response = await axios.get(proxyApi);
            const price = response.data.chart.result[0].meta.regularMarketPrice;
            const prevClose = response.data.chart.result[0].meta.chartPreviousClose;
            const changePercent = (((price - prevClose) / prevClose) * 100).toFixed(2);
            return { price, changePercent };
        };

        const coinData = await fetchStock('COIN');
        const hoodData = await fetchStock('HOOD');

        return {
            COIN: coinData,
            HOOD: hoodData
        };
    } catch (error) {
        console.error('[-] Error fetching corporate data:', error.message);
        return null;
    }
}

async function scrapeFarsideETF() {
    if (!process.env.PROXY_API_KEY && process.env.NODE_ENV === 'production') {
        return { rawText: 'PROXY ERROR: PROXY_API_KEY is not defined in Render environment variables. You must set it to route traffic.' };
    }
    
    console.log('[+] Scraping Farside ETF data via ScrapingBee API...');
    try {
        const response = await axios.get('https://app.scrapingbee.com/api/v1/', { 
            params: {
                api_key: process.env.PROXY_API_KEY,
                url: 'https://farside.co.uk/?p=997',
                render_js: 'true',
                stealth_proxy: 'true',
                extract_rules: '{"body_text":"body"}'
            },
            timeout: 120000 
        });
        
        // ScrapingBee returns a JSON object when using extract_rules
        const text = response.data && response.data.body_text ? response.data.body_text.substring(0, 3000) : JSON.stringify(response.data).substring(0, 3000);
        return { rawText: text };
    } catch (error) {
        let details = error.message;
        if (error.response && error.response.data) {
             const dataStr = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
             details += " | ScrapingBee Data: " + dataStr;
        }
        console.error('[-] Error scraping Farside:', details);
        return { rawText: `PROXY ERROR: Farside Scraper failed: ${details}` };
    }
}

// Function to screenshot Coinglass Liquidation Heatmap using ScrapingBee API
async function takeCoinglassScreenshot(ticker) {
    if (!process.env.PROXY_API_KEY && process.env.NODE_ENV === 'production') {
        return `PROXY ERROR: PROXY_API_KEY is not defined. Cannot capture heatmap.`;
    }

    console.log(`[+] Taking screenshot for ${ticker} via ScrapingBee API...`);
    try {
        const jsScenario = {
            instructions: [
                { "evaluate": "if(window.location.href.includes('login') || document.body.innerText.includes('Sign in')) throw new Error('AUTH_FAILED');" },
                { "wait_for": "input.MuiAutocomplete-input" },
                { "wait": 1000 },
                { "evaluate": "const input = document.querySelector('input.MuiAutocomplete-input'); if(input) { input.id = 'target-heatmap-input'; input.focus(); input.setSelectionRange(0, input.value.length); }" },
                { "wait": 1000 },
                { "fill": ["#target-heatmap-input", ticker] },
                { "wait_for": "li.MuiAutocomplete-option" },
                { "wait": 1000 },
                { "evaluate": "const opt = document.querySelector('li.MuiAutocomplete-option'); if(opt) { opt.dispatchEvent(new MouseEvent('mousedown', {bubbles: true})); opt.click(); opt.dispatchEvent(new MouseEvent('mouseup', {bubbles: true})); }" },
                { "wait": 5000 },
                { "evaluate": "const style = document.createElement('style'); style.innerHTML = '* { filter: none !important; backdrop-filter: none !important; } div[role=\"dialog\"], .MuiDialog-root, .MuiModal-root { display: none !important; opacity: 0 !important; visibility: hidden !important; }'; document.head.appendChild(style);" },
                { "wait": 15000 }
            ]
        };
        
        const params = {
            api_key: process.env.PROXY_API_KEY,
            url: 'https://www.coinglass.com/pro/futures/LiquidationHeatMap',
            render_js: 'true',
            stealth_proxy: 'true',
            premium_proxy: 'true',
            screenshot: 'true',
            window_width: '1920',
            window_height: '1080',
            wait: '10000',
            js_scenario: JSON.stringify(jsScenario)
        };

        const tokenValue = process.env.COINGLASS_SESSION_COOKIE;
        const headers = {};
        
        if (tokenValue) {
            // 1. Inject as a Browser Cookie (ScrapingBee format: name=value)
            params.cookies = `obe=${tokenValue}`;
            
            // 2. Inject as a Custom HTTP Header (Fallback for internal API)
            // ScrapingBee requires forward_headers=true and the Spb- prefix for custom headers
            params.forward_headers = 'true';
            headers['Spb-Obe'] = tokenValue;
        }

        const response = await axios.get('https://app.scrapingbee.com/api/v1/', { 
            params,
            headers,
            responseType: 'arraybuffer',
            timeout: 120000 
        });
        
        const base64Screenshot = Buffer.from(response.data, 'binary').toString('base64');
        return base64Screenshot;
    } catch (error) {
        let details = error.message;
        if (error.response && error.response.data) {
             details += " | ScrapingBee Data: " + Buffer.from(error.response.data).toString('utf-8');
        }
        
        if (details.includes('AUTH_FAILED')) {
            return `AUTH_FAILED: CoinGlass cookie expired. Please update Render environment variables.`;
        }
        
        console.error(`[-] Error scraping Coinglass for ${ticker}:`, details);
        return `PROXY ERROR: Coinglass Scraper (${ticker}) failed: ${details}`;
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
        (payload.btcScreenshot && payload.btcScreenshot.includes('PROXY ERROR')) ||
        (payload.ethScreenshot && payload.ethScreenshot.includes('PROXY ERROR')) ||
        (payload.solScreenshot && payload.solScreenshot.includes('PROXY ERROR'));

    let failureContext = '';
    let btcPrompt = `"BTC_Kill_Zone": "$74,800"`;
    let ethPrompt = `"ETH_Kill_Zone": "$3,850"`;
    let solPrompt = `"SOL_Kill_Zone": "$185"`;

    if (payload.btcScreenshot && payload.btcScreenshot.includes('PROXY ERROR')) {
        btcPrompt = `"BTC_Kill_Zone": "RADAR JAMMED"`;
        failureContext += `BTC Scraper Error: ${payload.btcScreenshot}. `;
    }
    if (payload.ethScreenshot && (payload.ethScreenshot.includes('PROXY ERROR') || payload.ethScreenshot.includes('PAYWALLED'))) {
        ethPrompt = `"ETH_Kill_Zone": "PAYWALLED"`;
        if (payload.ethScreenshot.includes('PROXY ERROR')) failureContext += `ETH Scraper Error: ${payload.ethScreenshot}. `;
    }
    if (payload.solScreenshot && (payload.solScreenshot.includes('PROXY ERROR') || payload.solScreenshot.includes('PAYWALLED'))) {
        solPrompt = `"SOL_Kill_Zone": "PAYWALLED"`;
        if (payload.solScreenshot.includes('PROXY ERROR')) failureContext += `SOL Scraper Error: ${payload.solScreenshot}. `;
    }
    if (payload.etfFlow.rawText.includes('PROXY ERROR') || payload.etfFlow.rawText.includes('Cloudflare')) {
        failureContext += `ETF Scraper Error: ${payload.etfFlow.rawText}. `;
    }

    if (failureContext) {
        failureContext = `SOME SCRAPERS FAILED: ${failureContext}. For any jammed metrics, you MUST output "RADAR JAMMED". Do not hallucinate data for jammed metrics.\n`;
    }
    
    let heatmapParts = [];
    [payload.btcScreenshot, payload.ethScreenshot, payload.solScreenshot].forEach(s => {
        if (s && typeof s === 'string' && !s.includes('PROXY ERROR') && !s.includes('PAYWALLED') && !s.includes('AUTH_FAILED')) {
            heatmapParts.push({ inline_data: { mime_type: "image/png", data: s } });
        }
    });

    const corpPrompt = payload.corpData ? 
        `COIN: Price $${payload.corpData.COIN.price}, 24h Change: ${payload.corpData.COIN.changePercent}%\nHOOD: Price $${payload.corpData.HOOD.price}, 24h Change: ${payload.corpData.HOOD.changePercent}%` 
        : `[CRITICAL: THE PROXY OR RATE LIMIT BLOCKED CORPORATE DATA. YOU MUST OUTPUT "RADAR JAMMED" FOR Corporate_Sentiment.]`;

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
                              `"Actionable_Intel": "[Translate this intel into ${lang}]: Analyze current liquidity clusters. Summarize ETF flows and retail sentiment.",\n` +
                              `${btcPrompt},\n` +
                              `${ethPrompt},\n` +
                              `${solPrompt}\n` +
                              `}\n\n` +
                              `Please analyze the following crypto risk-management data and format your response into the exact JSON structure above. Use the following live anchor prices:\n` +
                              `BTC Price: $${payload.cryptoData.btcPrice}\n` +
                              `ETH Price: $${payload.cryptoData.ethPrice}\n` +
                              `SOL Price: $${payload.cryptoData.solPrice}\n` +
                              `Fear & Greed Index: ${payload.cryptoData.fearAndGreed.value} (${payload.cryptoData.fearAndGreed.classification})\n` +
                              `${corpPrompt}\n` +
                              `Raw Farside ETF Data:\n${payload.etfFlow.rawText}\n\n` +
                              `CRITICAL DIRECTIVES:\n` +
                              `1. "Corporate_Sentiment": You MUST analyze the COIN and HOOD stock prices. Output a 2-3 sentence detailed summary. Provide a highly detailed breakdown. YOU MUST TRANSLATE THIS ENTIRE SUMMARY INTO ${lang}. DO NOT OMIT THIS KEY.\n` +
                              `2. "BTC_Kill_Zone" / "ETH_Kill_Zone" / "SOL_Kill_Zone": Analyze the attached Coinglass liquidation heatmaps. Find the heaviest liquidation clusters STRICTLY BELOW the live anchor prices. Format the values WITH a dollar sign and commas (e.g. "$74,800"). IF THE IMAGE IS A CLOUDFLARE CHALLENGE PAGE OR MISSING, YOU MUST OUTPUT "RADAR JAMMED".\n` +
                              `3. "Actionable_Intel": Provide a highly detailed 3-4 sentence strategic analysis synthesizing ONLY the institutional ETF flows and Kill Zones. YOU MUST TRANSLATE THIS ENTIRE ANALYSIS INTO ${lang}. DO NOT mention retail sentiment, COIN, or HOOD, as that is covered separately.`
                        },
                        ...heatmapParts
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
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

// Trust the Render proxy so rate limiting works per user IP instead of banning everyone
app.set('trust proxy', 1);

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

// Stripe Session Verification & JWT Generation// Health Check Endpoint (Keep-Alive)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 200, message: "ARES Engine Hot" });
});

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
    
    try {
        // Run sequentially to prevent 429 Too Many Requests from ScrapingBee's 1 concurrent request limit on free tiers
        const cryptoData = await fetchCryptoData();
        const etfFlow = await scrapeFarsideETF();
        const btcScreenshot = await takeCoinglassScreenshot('BTC');
        const ethScreenshot = await takeCoinglassScreenshot('ETH');
        const solScreenshot = await takeCoinglassScreenshot('SOL');
        const corpData = await fetchCorporateData();
        
        const payload = {
            cryptoData,
            etfFlow,
            btcScreenshot,
            ethScreenshot,
            solScreenshot,
            corpData
        };
        
        sharedPayloadCache = { payload, timestamp: Date.now() };
        finalResponseCache = {}; // Clear translation cache
        console.log('[+] Background sweep completed and cached.');
    } catch (e) {
        console.error('[-] Error in background sweep:', e);
    } finally {
        isSweeping = false;
    }
}

// Start background cron job every 60 minutes
runBackgroundSweep();
setInterval(runBackgroundSweep, 60 * 60 * 1000);

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
                const parsed = JSON.parse(responseText);
                
                finalJson = {
                    "Market_Posture": parsed.Market_Posture || "UNKNOWN",
                    "Fear_Greed_Score": parsed.Fear_Greed_Score || sharedPayloadCache.payload.cryptoData.fearAndGreed.value || "50",
                    "Corporate_Sentiment": parsed.Corporate_Sentiment || "RADAR JAMMED - UNABLE TO ACQUIRE CORPORATE DATA",
                    "Net_ETF_Flow": parsed.Net_ETF_Flow || "RADAR JAMMED",
                    "Actionable_Intel": parsed.Actionable_Intel || "Awaiting intelligence...",
                    "BTC_Kill_Zone": parsed.BTC_Kill_Zone || "RADAR JAMMED",
                    "ETH_Kill_Zone": parsed.ETH_Kill_Zone || "RADAR JAMMED",
                    "SOL_Kill_Zone": parsed.SOL_Kill_Zone || "RADAR JAMMED"
                };
            } catch(e) {
                finalJson = {
                    "Market_Posture": "UNKNOWN",
                    "Fear_Greed_Score": sharedPayloadCache.payload.cryptoData.fearAndGreed.value || "50",
                    "Corporate_Sentiment": "RADAR JAMMED",
                    "Net_ETF_Flow": "RADAR JAMMED",
                    "Actionable_Intel": "RADAR JAMMED - AI Synthesis Engine Failed to parse data.",
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

async function analyzeAltcoinHeatmap(ticker, base64Image) {
    console.log(`[+] Asking Gemini 2.5 Flash to estimate Kill Zone for ${ticker}...`);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const currentPriceRaw = await fetchAltcoinPrice(ticker);
    const currentPrice = currentPriceRaw ? `$${currentPriceRaw}` : 'unknown';

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const hasFailedScrape = !base64Image || base64Image.includes('PROXY ERROR');
    const failureInstruction = hasFailedScrape ? `\n[CRITICAL: THE PROXY HAS FAILED TO CAPTURE THE HEATMAP OR IT IS JAMMED. YOU MUST OUTPUT "RADAR JAMMED" FOR Kill_Zone.]` : '';

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `You are a quantitative risk AI. The current live spot price of ${ticker} is ${currentPrice}. Analyze the attached Coinglass liquidation heatmap screenshot. You MUST find the heaviest liquidation cluster STRICTLY BELOW the current price of ${currentPrice}. Do not hallucinate. Do not output a target higher than the current price. Output ONLY valid JSON in this format: { "Kill_Zone": "[Price]", "Threat_Level": "[HIGH, ELEVATED, or STABLE]" }${failureInstruction}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
        }
    };

    if (!hasFailedScrape) {
        requestBody.contents[0].parts.push({
            inlineData: {
                mimeType: "image/png",
                data: base64Image
            }
        });
    }

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
        const screenshot = await takeCoinglassScreenshot(ticker);
        const jsonResult = await analyzeAltcoinHeatmap(ticker, screenshot);
        
        if (!jsonResult) {
            return res.status(500).json({ error: 'Failed to analyze heatmap data' });
        }
        
        // Ensure final shape is strictly adhered to so UI doesn't crash
        const finalJson = {
            "Kill_Zone": jsonResult.Kill_Zone || "RADAR JAMMED",
            "Threat_Level": jsonResult.Threat_Level || "HIGH"
        };
        
        res.json(finalJson);
    } catch (error) {
        console.error(`Error handling /api/altcoin request for ${ticker}:`, error);
        res.status(500).json({ error: 'Internal server error while evaluating altcoin.' });
    }
});


app.get('/api/debug-cache', (req, res) => {
    res.json(sharedPayloadCache);
});

app.get('/api/test-scrape', async (req, res) => {
    try {
        const testUrl = req.query.url || 'https://coinank.com/liquidation-heatmap';
        console.log('[+] Testing scrape for:', testUrl);
        const params = {
            api_key: process.env.PROXY_API_KEY,
            url: testUrl,
            render_js: 'true',
            stealth_proxy: 'true',
            premium_proxy: 'true',
            screenshot: 'true',
            window_width: '1920',
            window_height: '1080',
            wait: '15000'
        };
        if (req.query.country_code) {
            params.country_code = req.query.country_code;
        }
        const response = await axios.get('https://app.scrapingbee.com/api/v1/', { 
            params: params,
            responseType: 'arraybuffer'
        });
        res.json({ success: true, status: response.status, screenshotLength: response.data.length });
    } catch (error) {
        res.json({ success: false, error: error.message, status: error.response?.status, dataLength: error.response?.data?.length });
    }
});

// === WHALE WATCH GEO-BYPASS ===
let recentLiquidations = [];
let sseClients = [];

function initWhaleWatchStream() {
    // Pre-populate with recent historical liquidations so the UI isn't empty on load
    axios.get('https://fapi.binance.com/fapi/v1/allForceOrders')
        .then(response => {
            if (response.data && Array.isArray(response.data)) {
                const historical = response.data
                    .map(order => {
                        const size = parseFloat(order.q) * parseFloat(order.p);
                        if (size <= 1000) return null;
                        
                        const isLong = order.S === 'SELL';
                        const formattedSize = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(size);
                        const sideText = isLong ? 'Longs Liquidated' : 'Shorts Liquidated';
                        const icon = isLong ? '🚨' : '🟢';
                        const colorClass = isLong ? 'text-red-400' : 'text-green-400';
                        const liqText = `${formattedSize} ${order.s.replace('USDT', '')} ${sideText}`;
                        
                        return { text: liqText, icon, colorClass, id: order.time + order.s };
                    })
                    .filter(Boolean)
                    .reverse() // Most recent first
                    .slice(0, 15);
                    
                recentLiquidations = historical;
            }
        })
        .catch(err => console.error('[-] Failed to pre-fetch historical liquidations:', err.message));

    // The backend server connects directly. No proxy needed since Render is not blocked, 
    // and the proxy was stripping WebSocket upgrade requests.
    const ws = new WebSocket('wss://fstream.binance.com/ws/!forceOrder@arr');
    
    ws.on('open', () => {
        console.log('[+] Whale Watch Uplink Established (Direct Backend Stream)');
    });
    
    ws.on('message', (data) => {
        try {
            const payload = JSON.parse(data);
            if (payload.e === 'forceOrder') {
                const order = payload.o;
                const size = (parseFloat(order.q) * parseFloat(order.p));
                
                if (size > 1000) {
                    const isLong = order.S === 'SELL';
                    const formattedSize = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(size);
                    const sideText = isLong ? 'Longs Liquidated' : 'Shorts Liquidated';
                    const icon = isLong ? '🚨' : '🟢';
                    const colorClass = isLong ? 'text-red-400' : 'text-green-400';
                    const liqText = `${formattedSize} ${order.s.replace('USDT', '')} ${sideText}`;
                    
                    const newLiq = { text: liqText, icon, colorClass, id: payload.E + order.s };
                    recentLiquidations.unshift(newLiq);
                    recentLiquidations = recentLiquidations.slice(0, 15);
                    
                    sseClients.forEach(client => {
                        client.res.write(`data: ${JSON.stringify(recentLiquidations)}\n\n`);
                    });
                }
            }
        } catch (e) {}
    });
    
    ws.on('error', (err) => {
        console.error('[-] Whale Watch proxy error:', err.message);
    });
    
    ws.on('close', () => {
        console.log('[-] Whale Watch connection closed. Reconnecting in 5s...');
        setTimeout(initWhaleWatchStream, 5000);
    });
}

// Spin up proxy tunnel
initWhaleWatchStream();

// SSE Broadcast Endpoint
app.get('/api/stream/liquidations', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const client = { id: Date.now(), res };
    sseClients.push(client);
    
    res.write(`data: ${JSON.stringify(recentLiquidations)}\n\n`);
    
    req.on('close', () => {
        sseClients = sseClients.filter(c => c.id !== client.id);
    });
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
