import React from 'react'

const Main = () => {
  return (
    <main>
      <form>
        <input 
          type="text" 
          placeholder="e.g. avocado"
          aria-label="Add ingredient" 
        />
        <button>Add Ingredient</button>
      </form>
    </main>
  )
}


export default Main