import React from "react"
import TokenCard from "./TokenCard"

const Tokens = ({ tokens }) => {
  console.log("Tokens", tokens)
  return (
    <div>
      Tokens:
      {
        tokens && tokens.map(token => {
          return <TokenCard token={token} />
        })  
      }
    </div>
  )
}

export default Tokens
