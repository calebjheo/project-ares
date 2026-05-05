require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

async function getAltcoinData(ticker) {
    console.log(`\n[+] Initiating scrape for ${ticker}...`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Dynamic Coinglass URL structure
        const url = `https://www.coinglass.com/pro/liquidation/${ticker}`;
        console.log(`[+] Navigating to: ${url}`);
        
        // Wait for network idle or timeout to capture whatever is rendered (bypassing strict blocks for screenshot)
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Optional: wait a moment for charts to render if it's a dynamic SPA
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Take base64 screenshot
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

    // Must use Gemini 1.5 Pro for multimodal image processing
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
        
        // Clean markdown JSON formatting if present
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const jsonResult = JSON.parse(responseText);
        console.log(`[+] Gemini Output for ${ticker}:`, jsonResult);
        return jsonResult;
    } catch (error) {
        console.error(`[-] Error analyzing ${ticker} with Gemini:`, error.response ? JSON.stringify(error.response.data) : error.message);
        return null;
    }
}

async function runTest() {
    console.log('=== STARTING ALTCOIN ENGINE BETA TEST ===');
    const tickersToTest = ['AVAX', 'DOGE'];

    for (const ticker of tickersToTest) {
        const screenshot = await getAltcoinData(ticker);
        if (screenshot) {
            await analyzeAltcoinHeatmap(ticker, screenshot);
        } else {
            console.log(`[-] Failed to retrieve data for ${ticker}.`);
        }
    }
    
    console.log('\n=== TEST COMPLETE ===');
}

runTest();
