import React from "react"
import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import CollectionStats from "./CollectionStats"
import AssetList from "./AssetList"
import OfferModal from "./OfferModal"
import { useOsStore } from "../../stores/useOsStore"

const OpenSeaCollection = ({ data }) => {
  const osOfferModalOpen = useOsStore(state => state.osOfferModalOpen)

  if (!data) return <></>

  return (
    <div className="flex w-full flex-col md:px-10 lg:px-16">
      {/* needs banner image */}
      <CollectionBanner banner={data.collection.banner_image_url} />
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col items-center p-4 md:w-1/3">
          <CollectionInfo
            name={data.collection.name}
            description={data.collection.description}
            numOwners={data.collection.num_owners}
            totalSupply={data.collection.total_supply}
            verified={data.collection.safelist_request_status}
          />
          <CollectionStats
            floor={data.collection.floor_price}
            avg={data.collection.average_price}
            volume={data.collection.total_volume}
          />
        </div>
        <AssetList assets={data.assets} />
      </div>
      {/* offer modal */}
      {osOfferModalOpen ? <OfferModal /> : <></>}
    </div>
  )
}

export default OpenSeaCollection
