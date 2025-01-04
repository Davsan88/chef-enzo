import React from 'react'
import ReactMarkdown from 'react-markdown'

const EnzoRecipe = ({recipe}) => {

    return (
        <section>
            <ReactMarkdown>{recipe}</ReactMarkdown>
        </section>
    )
}

export default EnzoRecipe