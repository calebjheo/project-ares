require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function testETH() {
    console.log("Starting ETH test...");
    const targetUrl = encodeURIComponent(`https://www.coinglass.com/pro/futures/LiquidationHeatMap`);
    const jsScenario = {
        instructions: [
            { "click": "input.MuiAutocomplete-input" },
            { "wait": 1000 },
            { "evaluate": "const clearBtn = document.querySelector('button[aria-label=\"Clear\"]') || document.querySelector('button[title=\"Clear\"]') || document.querySelector('.MuiAutocomplete-clearIndicator') || document.querySelector('button[aria-label=\"Close\"]'); if(clearBtn) clearBtn.click();" },
            { "wait": 1000 },
            { "fill": ["input.MuiAutocomplete-input", "ETH"] },
            { "wait_for": "li.MuiAutocomplete-option" },
            { "click": "li.MuiAutocomplete-option" },
            { "wait": 10000 }
        ]
    };
    
    let proxyApi = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.PROXY_API_KEY}&url=${targetUrl}&render_js=true&stealth_proxy=true&premium_proxy=true&screenshot=true&window_width=1920&window_height=1080&wait=10000&js_scenario=${encodeURIComponent(JSON.stringify(jsScenario))}`;
    
    try {
        const response = await axios.get(proxyApi, { responseType: 'arraybuffer', timeout: 120000 });
        fs.writeFileSync('test_eth.png', response.data);
        console.log("Saved test_eth.png!");
    } catch (e) {
        console.log("Error:", e.message);
        if (e.response && e.response.data) {
            console.log(e.response.data.toString());
        }
    }
}

testETH();
