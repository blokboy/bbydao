import React from "react"
import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import CollectionStats from "./CollectionStats"
import AssetList from "./AssetList"

const OpenSeaCollection = ({ data }) => {
  console.log("OpenSeaCollection", data)

  // collection info
  // - name
  // - description
  // - total owners
  // - total supply
  // - verified
  // - supply
  // - owned by

  // collection stats
  // - mkt cap
  // - floor
  // - avg price
  // - volume

  // assets
  // - name
  // - number of sales
  // - owner (prof pic)
  // - price
  // - rarity score
  //

  return (
    <div className="flex flex-col h-full w-screen items-center">
      <div className="flex flex-col h-full w-full md:w-3/4">
        <CollectionBanner banner={data.banner_image_url} />
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full md:w-1/3 items-center p-4">
            <CollectionInfo name={data.name} description={data.description} />
            <CollectionStats />
          </div>
          <AssetList />
        </div>
      </div>
    </div>
  )
}

export default OpenSeaCollection
