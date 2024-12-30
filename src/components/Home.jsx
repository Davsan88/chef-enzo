import React, { useState } from 'react'

const Home = () => {

  const [ingredients, setIngredients] = useState(["avocado", "tomato", "red onion", "chili"])

  
  
  const ingredientsListItems = ingredients.map(ingredient => (
    <li key={ingredient}>{ingredient}</li>
  ))

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient")
    setIngredients(prevIngredient => [...prevIngredient, newIngredient])
  }


  return (
    <main>
      <form action={addIngredient} className='form'>
        <input 
          type="text" 
          placeholder="e.g. avocado"
          aria-label="Add ingredient" 
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>
      <ul>
        {ingredientsListItems}
      </ul>
    </main>
  )
}


export default Home