const axios = require('axios');

async function testProdBackend() {
    try {
        console.log("Hitting https://ares-backend-fwr0.onrender.com/api/risk...");
        const response = await axios.get('https://ares-backend-fwr0.onrender.com/api/risk');
        console.log("SUCCESS:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("ERROR:");
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testProdBackend();
