import React, { useState } from 'react'
import IngredientList from './IngredientList'
import EnzoRecipe from './EnzoRecipe'
import { getRecipeFromMistral } from '../../ai'


const Home = () => {

  const [ingredients, setIngredients] = useState([])

  const [recipe, setRecipe] = useState("")

  const fetchRecipe = async () => {
    console.log("Ingredients being passed:", ingredients);
    const generatedRecipe = await getRecipeFromMistral(ingredients)
    setRecipe(generatedRecipe)
    console.log("Generated Recipe:", generatedRecipe);
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