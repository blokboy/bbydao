import React from "react"
import Head from "next/head"

import CollectionBanner from "./CollectionBanner"
import CollectionInfo from "./CollectionInfo"
import AssetList from "./AssetList"

import useERC721Contract from "hooks/useERC721Contract"
import * as zoraApi from 'query/zoraQuery'
import { useQuery } from "react-query"

const Collection = ({ data, address }) => {
  console.log('Collection.js', data)

  const {
    data: firstMintResult,
    status,
    isLoading: firstMintLoading,
  } = useQuery(["firstMint", address], () => zoraApi.firstMint(address), {
    enabled: !!address,
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })
  console.log('firstMintResult', firstMintResult)


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

  const head = React.useMemo(() => {
    return collection ? (
      <Head>
        <title>bbyDAO | {collection.name} NFT Collection</title>
        <meta name="description" content={collection.description} />
      </Head>
    ) : null
  }, [collection])

  if (!data) return <div className="h-screen">collection fetch failed</div>

  return (
    <>
    <h1>collection</h1>
      {/* {head}
      <div className="flex w-full flex-col pt-4">
        <CollectionBanner banner={collection.banner_image_url} />
        <div className="flex flex-col p-4 md:flex-row">
          <div className="flex w-full flex-col items-center md:w-1/3">
            <CollectionInfo
              address={collection.address}
              name={collection.name}
              description={collection.description}
              numOwners={collection.num_owners}
              totalSupply={collection.total_supply}
              verified={collection.safelist_request_status}
              floor={collection.floor_price}
              avg={collection.average_price}
              volume={collection.total_volume}
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
      </div> */}
    </>
  )
}

export default Collection
