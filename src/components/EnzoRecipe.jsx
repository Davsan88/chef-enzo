import React from 'react'
import ReactMarkdown from 'react-markdown'

const EnzoRecipe = ({recipe}) => {

    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Chef Enzos's Recommendation:</h2>
            <ReactMarkdown>{recipe}</ReactMarkdown>
        </section>
    )
}

export default EnzoRecipe