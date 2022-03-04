import React from "react"
import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import AssetList from "./AssetList"

const OpenSeaCollection = ({ data, slug }) => {
  if (!data) return <div className="h-screen">collection fetch failed</div>

  return (
    <div className="flex w-full flex-col pt-4">
      {/* needs banner image */}
      <CollectionBanner banner={data.collection.banner_image_url} />
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col items-center md:w-1/3">
          <CollectionInfo
            name={data.collection.name}
            description={data.collection.description}
            numOwners={data.collection.num_owners}
            totalSupply={data.collection.total_supply}
            verified={data.collection.safelist_request_status}
            floor={data.collection.floor_price}
            avg={data.collection.average_price}
            volume={data.collection.total_volume}
          />
        </div>
        <div className="w-full md:w-2/3">
          <AssetList
            assets={data.assets}
            address={data?.collection?.address}
            slug={slug}
          />
        </div>
      </div>
    </div>
  )
}

export default OpenSeaCollection
