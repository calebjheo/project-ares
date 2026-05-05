const axios = require('axios');

async function testLocalBackend() {
    try {
        console.log("Hitting localhost:3001/api/risk...");
        const response = await axios.get('http://localhost:3001/api/risk');
        console.log("SUCCESS:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("ERROR:");
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testLocalBackend();
