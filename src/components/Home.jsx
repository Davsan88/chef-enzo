import React, { useState } from 'react'
import IngredientList from './IngredientList'
import EnzoRecipe from './EnzoRecipe'


const Home = () => {

  const [ingredients, setIngredients] = useState([])

  const [recipe, setRecipe] = useState("")

  const fetchRecipe = async () => {
    try {
      const response = await fetch('/api/hfRecipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to fetch the recipe')
      }
  
      const data = await response.json() // { recipe: "Your recipe here" }
      setRecipe(data.recipe)
      console.log("Generated Recipe:", data.recipe)
    } catch (err) {
      console.error(err)
    }
  }
  
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

      {ingredients.length > 0 &&
        <IngredientList
          ingredients={ingredients}
          fetchRecipe={fetchRecipe}
        />}

      {recipe && <EnzoRecipe recipe={recipe} />}

    </main>
  )
}


export default Home