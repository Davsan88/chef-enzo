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

// Ensure you're using the environment variable for your API key
const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);


// Function to fetch recipe suggestions
export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3", // Specify the Hugging Face model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024, // Adjust as needed
    });
    return response.choices[0].message.content; // Extract the recipe from the response
  } catch (err) {
    console.error("Error fetching recipe:", err.message);
  }
}