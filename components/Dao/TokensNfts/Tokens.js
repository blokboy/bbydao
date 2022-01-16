import React from "react"

const Tokens = ({ tokens }) => {
  console.log("Tokens", tokens)
  return (
    <div>
      <h1>Tokens: {tokens.length}</h1>
    </div>
  )
}

export default Tokens
