import React, { useState } from 'react'

const Main = () => {

  const [ingredients, setIngredients] = useState()
  


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