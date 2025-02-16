const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
async function getClaudeResponse(prompt) {
    const API_URL = 'https://api.anthropic.com/v1/messages';

    // Check if parameters are provided
    if (!prompt || !apiKey) {
        throw new Error('Both prompt and API key are required');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Access-Control-Allow-Origin': '*',  // Note: This needs to be set on the server side
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
            },
            mode: 'cors', // Enable CORS
            credentials: 'include', // Include credentials if needed
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });

        // Provide more specific error messages
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error(`
                Network error: Unable to reach Anthropic API. This might be due to:
                1. CORS restrictions - You may need to set up a proxy server
                2. Network connectivity issues
                3. API endpoint being blocked by browser security
                
                Solution: Set up a proxy server to handle the API requests. Example proxy setup:
                
                // Server (Node.js/Express):
                const express = require('express');
                const cors = require('cors');
                const app = express();
                
                app.use(cors());
                app.post('/api/claude', async (req, res) => {
                    // Forward the request to Anthropic
                    // Add your proxy logic here
                });
                
                // Then update the API_URL to point to your proxy:
                // const API_URL = 'https://your-server.com/api/claude';
            `);
        }
        throw error;
    }
}

export default getClaudeResponse;
