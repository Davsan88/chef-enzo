import React, { useState } from 'react'

const Main = () => {

  const [ingredients, setIngredients] = useState()
  
  const ingredientsListItems = ingredients.map(ingredient => (
    <li key={ingredient}>{ingredient}</li>
  ))


  return (
    <main>
      <form className='form'>
        <input 
          type="text" 
          placeholder="e.g. avocado"
          aria-label="Add ingredient" 
        />
        <button>Add ingredient</button>
      </form>
    </main>
  )
}


export default Main