import React from "react"

const Nfts = ({ collectibles }) => {
  console.log("Nfts", collectibles)
  return (
    <div>
      <h1>Collectibles: {collectibles.length}</h1>
    </div>
  )
}

export default Nfts
