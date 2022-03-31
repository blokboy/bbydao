import React from "react"

import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import AssetList from "./AssetList"

import useERC721Contract from "hooks/useERC721Contract"

const OpenSeaCollection = ({ data, slug }) => {
  const [ticker, setTicker] = React.useState(null)

  const collection = React.useMemo(() => {
    if (!data || !data.collection) {
      return null
    }

    return data.collection
  }, [data])

  const contract = useERC721Contract(collection?.address)

  const handleTicker = React.useCallback(async () => {
    if (!contract) {
      return
    }

    try {
      setTicker(await contract.symbol())
    } catch (err) {
      setTicker("")
      console.log(err)
    }
  }, [contract])

  React.useEffect(() => {
    if (ticker === null) {
      handleTicker()
    }
  }, [handleTicker])

  if (!data) return <div className="h-screen">collection fetch failed</div>

  return (
    <div className="flex w-full flex-col pt-4">
      {/* needs banner image */}
      <CollectionBanner banner={data.collection.banner_image_url} />
      <div className="flex flex-col p-4 md:flex-row">
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
            ticker={ticker}
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
