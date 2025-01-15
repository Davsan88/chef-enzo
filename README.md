# 🍳 Chef Enzo Recipe App

## **Hey there! 👋**

Welcome to the **Chef Enzo Recipe App!** This project was built following a tutorial on Scrimba. The app lets you input a list of ingredients you have at home, and it uses AI to suggest some tasty recipes you can whip up. It's a fun way to get creative in the kitchen without wasting any ingredients!

---


## 🚀 **What It Does**

- **Add Ingredients**: Enter whatever ingredients you have—like tomatoes, basil, or avocado.
- **Get Recipe Ideas**: Click a button, and the app uses AI (thanks to Hugging Face) to generate some delicious recipe suggestions based on your ingredients.
- **Responsive Design**: Whether you're on your phone, tablet, or laptop, the app looks great and works smoothly.

---


## 🛠️ **Technologies Used**

- **Frontend**: React, JavaScript, CSS, Vite  
- **Backend**: Netlify Functions (Serverless)  
- **API**: Hugging Face Inference API  
- **Deployment**: Netlify  
- **Version Control**: GitHub  

---


## 🔄 **Workflow Guide: Building the Chef Enzo Recipe App**

### **1. Project Setup**
- **Action**:
  - Initialized a new React project using Vite.
  - Set up a GitHub repository and connected it with GitHub Desktop for version control.
  - Installed necessary dependencies like React, Hugging Face Inference API client, and development tools such as ESLint.

- **Purpose**:
  - Lay the groundwork for the project with proper version control and essential libraries.

---


### **2. Designing the User Interface**
- **Action**:
  - Created React components: `Header.jsx`, `Home.jsx`, `IngredientList.jsx`, and `EnzoRecipe.jsx`.
  - Implemented a responsive layout using CSS to ensure the app looks good on all devices.
  - Developed a form for users to input ingredients and dynamically display the list of added ingredients.

- **Purpose**:
  - Provide an intuitive and visually appealing interface for users to interact with the app.

---


### **3. Managing Ingredients**
- **Action**:
  - Utilized React's `useState` to manage the list of ingredients.
  - Enabled real-time updates of the ingredient list as users add new items.

```javascript
const [ingredients, setIngredients] = useState([]);

const addIngredient = (formData) => {
  const newIngredient = formData.get("ingredient");
  setIngredients(prev => [...prev, newIngredient]);
};
```

- **Purpose**:
  - Allow users to easily manage their list of ingredients, which is essential for generating relevant recipes.

---


### **4. Integrating Hugging Face Inference API**
- **Action**:
  - Used the `@huggingface/inference` library to interact with the Hugging Face API.
  - Created a system prompt to guide the AI in generating appropriate recipe suggestions based on user-provided ingredients.

```javascript
import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients provided by a user and suggests a recipe they can make using most or all of those ingredients.
Focus on using as many of the user's ingredients as possible.
You may suggest additional ingredients, but avoid recommending meat, fish, or dairy if none are included in the user's provided list.
Limit the number of additional ingredients to a reasonable amount to keep the recipe accessible.
Provide clear instructions for preparing the recipe.
Format your response in markdown for easy rendering on a web page.
`;

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error fetching recipe:", err.message);
  }
}
```

- **Purpose**:
  - Leverage AI capabilities to provide personalized and relevant recipe suggestions based on user input.

---


### **5. Securing the API Key with Netlify Functions**
- **Action**:
  - Implemented a serverless backend using Netlify Functions to handle API requests securely.
  - Moved the API interaction logic from the frontend to the backend to prevent exposing the Hugging Face API key.

#### **Steps Taken**
**Created `netlify/functions/hfRecipe.js` with ESM Syntax**:

```javascript
import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients provided by a user and suggests a recipe they can make using most or all of those ingredients.
Focus on using as many of the user's ingredients as possible.
You may suggest additional ingredients, but avoid recommending meat, fish, or dairy if none are included in the user's provided list.
Limit the number of additional ingredients to a reasonable amount to keep the recipe accessible.
Provide clear instructions for preparing the recipe.
Format your response in markdown for easy rendering on a web page.
`;

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
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });

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
```

#### **Updated `netlify.toml` Configuration**

```toml
[build]
  functions = "netlify/functions"  # Path to functions directory
  publish = "dist"                 # Vite's default build output directory

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### **Modified Frontend (`Home.jsx`) to Use the Netlify Function Endpoint**

```javascript
const fetchRecipe = async () => {
  try {
    const response = await fetch('/api/hfRecipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the recipe');
    }

    const data = await response.json(); // { recipe: "Your recipe here" }
    setRecipe(data.recipe);
    console.log("Generated Recipe:", data.recipe);
  } catch (err) {
    console.error(err);
  }
};
```

- **Purpose**:
  - Ensure sensitive information like the API key remains secure by handling API requests on the server side.

---


### **6. Setting Up Environment Variables**

- **Action**:
  - Removed the `VITE_` prefix from the API key in the `.env` file to prevent exposure in the frontend.
  - Added `HF_ACCESS_TOKEN` to Netlify's environment variables for secure access in serverless functions.

#### **`.env` File**

```env
HF_ACCESS_TOKEN=your_hugging_face_api_key
```

- **Purpose**:
  - Maintain the security of the API key by restricting its access to serverless functions only.

---


### **7. Testing and Deployment**

#### **Action**

- Tested the Netlify Functions locally using Netlify CLI (`netlify dev`) to ensure proper functionality.  
- Connected the GitHub repository to Netlify for continuous deployment.  
- Verified that the application works as expected in the live environment without exposing the API key.

#### **Steps Taken**

**Installed Netlify CLI**:

```bash
npm install -g netlify-cli
```

**Started Local Development Server**:

```bash
netlify dev
```

- Opened `http://localhost:8888` in the browser to see the app in action.

**Connected GitHub Repository to Netlify**:

- Authorized Netlify to access the GitHub repository.  
- Configured build settings (`npm run build` as the build command and `dist` as the publish directory).  
- Added `HF_ACCESS_TOKEN` in Netlify's environment variables settings.

