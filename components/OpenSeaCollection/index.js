import React from "react"
import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import CollectionStats from "./CollectionStats"
import AssetList from "./AssetList"

const OpenSeaCollection = ({ data }) => {
  console.log("OpenSeaCollection", data)
  return (
    <div className="flex flex-col h-full w-screen">
      <CollectionBanner banner={data.banner_image_url} />
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-1/3 p-4">
          <CollectionInfo name={data.name} />
          <CollectionStats />
        </div>
        <AssetList />
      </div>
    </div>
  )
}

export default OpenSeaCollection
