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

**Monitored Deployment**:

- Ensured successful builds without errors.  
- Tested the live site to confirm functionality.

- **Purpose**:
  - Achieve a seamless deployment process with continuous integration, ensuring that updates pushed to GitHub are automatically deployed.

---


## 🧩 **Main Components**

### **1. `Header.jsx`**

**What It Does**:  
Displays the app's header with the Chef Enzo logo and title.

**Code Overview**:

```javascript
import React from 'react';
import chefEnzoLogo from '../assets/chef-enzo.svg';

const Header = () => {
  return (
    <header role="banner">
      <img src={chefEnzoLogo} alt="Chef Enzo Logo" />
      <h1>Chef Enzo</h1>
    </header>
  );
};

export default Header;
```

---


### **2. `Home.jsx`**

**What It Does**:  
Manages the main functionality of the app, including adding ingredients and fetching recipes.

**Code Overview**:

```javascript
import React, { useState } from 'react';
import IngredientList from './IngredientList';
import EnzoRecipe from './EnzoRecipe';

const Home = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");

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

  const addIngredient = (formData) => {
    const newIngredient = formData.get("ingredient");
    setIngredients(prev => [...prev, newIngredient]);
  };

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addIngredient(new FormData(e.target));
          e.target.reset();
        }}
        className="form"
      >
        <input
          type="text"
          placeholder="e.g. avocado"
          aria-label="Add ingredient"
          name="ingredient"
          required
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientList
          ingredients={ingredients}
          fetchRecipe={fetchRecipe}
        />
      )}

      {recipe && <EnzoRecipe recipe={recipe} />}
    </main>
  );
};

export default Home;
```

---


### **3. `IngredientList.jsx`**

**What It Does**:  
Displays the list of ingredients added by the user and provides a button to generate a recipe.

**Code Overview**:

```javascript
import React from 'react';

const IngredientList = ({ ingredients, fetchRecipe }) => {
  return (
    <div className="ingredient-list">
      <h2>Your Ingredients:</h2>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <button onClick={fetchRecipe}>Generate Recipe</button>
    </div>
  );
};

export default IngredientList;
```

---


### **4. `EnzoRecipe.jsx`**

**What It Does**:  
Displays the generated recipe in a nicely formatted way using Markdown.

**Code Overview**:

```javascript
import React from 'react';
import ReactMarkdown from 'react-markdown';

const EnzoRecipe = ({ recipe }) => {
  return (
    <section className="suggested-recipe-container" aria-live="polite">
      <h2>Chef Enzo's Recommendation:</h2>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </section>
  );
};

export default EnzoRecipe;
```

---


### **5. `hfRecipe.js` (Netlify Function)**

**What It Does**:  
Handles API requests securely by interacting with the Hugging Face Inference API to generate recipes based on user ingredients.

**Code Overview**:

```javascript
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

---


## 💡 **Skills Learned**

- **React State Management**: Using `useState` to handle dynamic data like ingredients and recipes.
- **API Integration**: Connecting to external APIs (Hugging Face) to fetch data.
- **Serverless Functions**: Implementing Netlify Functions to handle backend operations securely.
- **Environment Variables**: Managing sensitive information securely using `.env` files and Netlify's environment settings.
- **Responsive Design**: Creating a user-friendly interface that works well on all devices.
- **Version Control**: Using GitHub and GitHub Desktop for managing code changes.
- **Continuous Deployment**: Setting up automatic deployments with Netlify connected to GitHub.
- **Error Handling**: Managing errors gracefully both in frontend and backend to enhance user experience.

---


### 📦 **Getting Started**

#### **Prerequisites**

- **Node.js**: Ensure Node.js v22.11.0 or higher is installed.
- **GitHub Account**: For version control and connecting to Netlify.
- **Netlify Account**: To deploy the app and handle serverless functions.

---


#### **Installation**

1. **Clone the Repository**:

```bash
git clone https://github.com/Davsan88/chef-enzo.git
cd chef-enzo-recipe-app
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Set Up Environment Variables**:

   - Create a `.env` file in the root of the project.
   - Add your Hugging Face API key:

```env
HF_ACCESS_TOKEN=your_hugging_face_api_key
```

   - **Note**: Ensure `.env` is listed in `.gitignore` to keep your API key safe!

4. **Run the App Locally**:

```bash
npm run dev
```

5. Open your browser and go to `http://localhost:8888` to see the app in action.

---


### 🌐 **Deployment**

#### **Connect to Netlify**

1. **Push Your Code to GitHub**:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Link GitHub to Netlify**:

   - Log in to your Netlify account.
   - Click on **Add new site** > **Import an existing project** > **GitHub**.
   - Authorize Netlify to access your GitHub repositories.
   - Select the `chef-enzo-recipe-app` repository.

3. **Set Up Build Settings**:

   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add `HF_ACCESS_TOKEN` with your Hugging Face API key in Netlify’s settings.

4. **Deploy**:

   - Click **Deploy site** and wait for Netlify to build and deploy your app.
   - Once done, you'll get a live URL to share with friends and family!

---


#### **Verify Deployment**

1. **Access Your Live Site**:

   - Netlify will provide a default subdomain (e.g., `chef-enzo-recipe-app.netlify.app`). You can customize this later if desired.

2. **Test Functionality**:

   - Add ingredients and generate recipes.
   - Ensure the app behaves as expected without exposing the API key.

3. **Check Netlify Function Logs**:

   - Go to your Netlify dashboard.
   - Navigate to **Functions** under your site.
   - Click on your `hfRecipe` function to view logs and ensure there are no runtime errors.

---


### 🎨 **Usage**

#### **Add Ingredients**:

- Enter an ingredient in the input field (e.g., "tomato") and click **Add ingredient**.
- The ingredient will appear in your list of selected ingredients.

#### **Generate Recipe**:

- After adding your desired ingredients, click on **Generate Recipe**.
- The app will fetch a recipe suggestion based on your ingredients and display it below.

---


### 📄 **License**

This project is private and meant for learning purposes. Please don’t copy or distribute it without permission.

---


### 🙌 **Acknowledgments**

- **Scrimba**: For the awesome tutorial that guided me through building this app.
- **Hugging Face**: For providing powerful AI tools to make the app smarter.
- **Netlify**: For making deployment and serverless functions a breeze.

---


### 📫 **Get in Touch**

Have questions or just want to say hi? Drop me an email at `david.sanchez.martinez@outlook.com`.