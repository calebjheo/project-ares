const axios = require('axios');

async function testApi() {
    console.log("Testing API...");
    try {
        const response = await axios.get('https://ares-backend-fwr0.onrender.com/api/altcoin?ticker=AVAX', { timeout: 60000 });
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
    } catch (err) {
        console.error("API Error:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testApi();
