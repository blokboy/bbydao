import React from "react"
import { useOsStore } from "stores/useOsStore"

const Nfts = ({ collectibles }) => {
  console.log("Nfts", collectibles)
  const setOsSellModalOpen = useOsStore(state => state.setOsSellModalOpen)

  return (
    <div>
      <h1>Collectibles: {collectibles.length}</h1>
      <button onClick={setOsSellModalOpen}>sell</button>
    </div>
  )
}

export default Nfts
