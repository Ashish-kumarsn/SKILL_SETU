// Simple Express.js proxy server for Gemini API
// Install: npm install express cors
// Run: node proxy-server.js

const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

// Your Gemini API key (store this in environment variables in production)
const GEMINI_API_KEY = 'AIzaSyBFTenNYuydbsF2lmZC32470j_TiA1b3sI';

app.use(cors());
app.use(express.json());

// Proxy endpoint for Gemini API
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const data = JSON.stringify({
        contents: [{
            parts: [{
                text: message
            }]
        }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const apiReq = https.request(options, (apiRes) => {
        let responseData = '';

        apiRes.on('data', (chunk) => {
            responseData += chunk;
        });

        apiRes.on('end', () => {
            try {
                const response = JSON.parse(responseData);
                
                if (apiRes.statusCode === 200) {
                    res.json({
                        success: true,
                        response: response.candidates[0].content.parts[0].text
                    });
                } else {
                    res.status(apiRes.statusCode).json({
                        success: false,
                        error: response.error?.message || 'API Error'
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Invalid API response'
                });
            }
        });
    });

    apiReq.on('error', (error) => {
        res.status(500).json({
            success: false,
            error: error.message
        });
    });

    apiReq.write(data);
    apiReq.end();
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Proxy server is running!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Gemini API Proxy Server running on http://localhost:${PORT}`);
    console.log(`📝 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
    console.log('\n📋 Example usage from your frontend:');
    console.log(`
    fetch('http://localhost:${PORT}/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello!' })
    })
    .then(res => res.json())
    .then(data => console.log(data.response));
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down proxy server...');
    process.exit(0);
});