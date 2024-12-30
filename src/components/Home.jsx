import React, { useState } from 'react'
import IngredientList from './IngredientList'
import EnzoRecipe from './EnzoRecipe'

const Home = () => {

  const [ingredients, setIngredients] = useState(["avocado", "tomato", "red onion", "chili"])

  const [recipeShown, setRecipeShown] = React.useState(false)


  function toggleRecipeShown() {
    setRecipeShown(prevShown => !prevShown)
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
          ingredients={ ingredients } 
          toggleRecipeShown={ toggleRecipeShown } 
        />}

      {recipeShown && <EnzoRecipe />}
      
    </main>
  )
}


export default Home