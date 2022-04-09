import React from "react"
import NftCard from "./NftCard"

const Nfts = ({ collectibles }) => {
  const nfts = React.useMemo(() => {
    return collectibles.length ? (
      <div className="grid grid-cols-3 gap-4 mt-4">
        {collectibles.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
      </div>
    ) : null
  }, [collectibles])

  return (
    <div className="mt-4">
      <h1>Collectibles: {collectibles.length}</h1>
      {nfts}
    </div>
  )
}

export default Nfts
