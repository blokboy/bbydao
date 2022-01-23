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
  // - total owners : data.num_owners
  // - total supply : data.total_supply
  // - verified : data.safelist_request_status
  // - supply :
  // - owned by

  // collection stats
  // - mkt cap
  // - floor : data.floor_price
  // - avg price : data.average_price
  // - volume : data.total_volume

  // assets
  // - name
  // - number of sales
  // - owner (prof pic)
  // - price
  // - rarity score
  //

  return (
    <div className="flex flex-col h-full w-screen items-center">
      <div className="flex flex-col h-full w-full md:px-10 lg:px-16">
        <CollectionBanner banner={data.banner_image_url} />
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full md:w-1/3 items-center p-4">
            <CollectionInfo
              name={data.name}
              description={data.description}
              numOwners={data.num_owners}
              totalSupply={data.total_supply}
              verified={data.safelist_request_status}
            />
            <CollectionStats
              floor={data.floor_price}
              avg={data.average_price}
              volume={data.total_volume}
            />
          </div>
          <AssetList />
        </div>
      </div>
    </div>
  )
}

export default OpenSeaCollection
