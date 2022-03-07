import React from "react"
import NftCard from "./NftCard"

const Nfts = ({ collectibles }) => {
  return (
    <div>
      <h1>Collectibles: {collectibles.length}</h1>
      <div className="grid grid-cols-2">
        {collectibles.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default Nfts
