const axios = require('axios');

async function listModels() {
    const apiKey = 'AIzaSyBzl873sSHaWL5tLTPkolaleRL-qUbLFhM';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await axios.get(apiUrl);
        const models = response.data.models.map(m => m.name);
        console.log("AVAILABLE MODELS:", models);
    } catch (error) {
        console.error("ERROR:", error.response ? error.response.data : error.message);
    }
}

listModels();
