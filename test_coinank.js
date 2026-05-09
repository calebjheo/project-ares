require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function testCoinank() {
    try {
        console.log('[+] Testing CoinAnk ScrapingBee...');
        
        const response = await axios.get('https://app.scrapingbee.com/api/v1/', { 
            params: {
                api_key: process.env.PROXY_API_KEY,
                url: 'https://coinank.com/liqMap?coin=ETH',
                render_js: 'true',
                stealth_proxy: 'true',
                premium_proxy: 'true',
                screenshot: 'true',
                window_width: '1920',
                window_height: '1080',
                wait: '15000',
            },
            responseType: 'arraybuffer',
            timeout: 120000 
        });
        
        fs.writeFileSync('coinank_eth.png', response.data);
        console.log('[+] Saved coinank_eth.png');
    } catch (error) {
        console.error('[-] Error:', error.message);
        if (error.response && error.response.data) {
             console.error(Buffer.from(error.response.data).toString('utf-8'));
        }
    }
}

testCoinank();
