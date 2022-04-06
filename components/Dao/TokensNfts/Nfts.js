import React from "react"
import NftCard from "./NftCard"

const Nfts = ({ collectibles }) => {
  const nfts = React.useMemo(() => {
    return collectibles.length ? (
      <div className="flex space-between flex-wrap lg:justify-center">
        {collectibles.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
      </div>
    ) : null
  }, [collectibles])

  return (
    <div>
      <h1>Collectibles: {collectibles.length}</h1>
      {nfts}
    </div>
  )
}

export default Nfts
