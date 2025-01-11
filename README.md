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


