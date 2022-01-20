import React from "react"
import AssetCard from "./AssetCard"

const AssetList = () => {
  return (
    <div className="flex w-full p-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mx-4 w-full">
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
      </div>
    </div>
  )
}

export default AssetList
