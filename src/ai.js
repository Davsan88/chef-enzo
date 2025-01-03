import { HfInference } from "@huggingface/inference";

// Ensure you're using the environment variable for your API key
const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);

// System prompt for the AI assistant
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

// Function to fetch recipe suggestions
export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Specify the Hugging Face model
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