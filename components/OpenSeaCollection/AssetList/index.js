import React from "react"
import AssetCard from "./AssetCard"

const AssetList = ({ assets }) => {
  return (
    <div className="mx-4 grid w-full grid-cols-1 justify-items-center gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset, index) => (
        <AssetCard key={index} asset={asset} />
      ))}
    </div>
  )
}

export default AssetList
