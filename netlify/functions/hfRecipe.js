// netlify/functions/hfRecipe.js

import { HfInference } from "@huggingface/inference";

// System prompt for the AI assistant
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients provided by a user and suggests a recipe they can make using most or all of those ingredients.

Focus on using as many of the user's ingredients as possible.
You may suggest additional ingredients, but avoid recommending meat, fish, or dairy if none are included in the user's provided list.
Limit the number of additional ingredients to a reasonable amount to keep the recipe accessible.
Provide clear instructions for preparing the recipe.
Format your response in markdown for easy rendering on a web page.
`;

// Initialize Hugging Face Inference with the API key from environment variables
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { ingredients } = JSON.parse(event.body);

    if (!ingredients || !Array.isArray(ingredients)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid ingredients data' }),
      };
    }

    const ingredientsString = ingredients.join(", ");

    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3", // Hugging Face model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024, // Adjust as needed
    });

    // Adjust this based on the actual response structure
    const recipe = response.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe }),
    };
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};