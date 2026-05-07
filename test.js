require('dotenv').config();
const { sendToGemini } = require('./index.js');

const mockPayload = {
    cryptoData: {
        btcPrice: 70000,
        ethPrice: 3500,
        solPrice: 150,
        fearAndGreed: { value: 75, classification: "Greed" }
    },
    etfFlow: {
        btcFlow: 'Scrape failed due to Cloudflare.',
        ethFlow: 'Scrape failed due to Cloudflare.'
    },
    screenshots: [
        'Scrape failed due to Cloudflare.',
        'Scrape failed due to Cloudflare.',
        'Scrape failed due to Cloudflare.'
    ]
};

async function run() {
    try {
        console.log("Sending...");
        const res = await sendToGemini(mockPayload, 'EN');
        console.log("Response:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
