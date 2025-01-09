const fetch = require('node-fetch'); // Ensure you have node-fetch installed
require('dotenv').config(); // Load environment variables

exports.handler = async (event) => {
  try {
    const { ingredients } = JSON.parse(event.body);

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: ingredients }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.text();
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    console.error('Error in Netlify Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
