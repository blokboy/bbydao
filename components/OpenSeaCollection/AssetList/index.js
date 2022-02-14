import React from "react"
import * as api from "query"
import { useQuery } from "react-query"
import { useInView } from "react-hook-inview"
import AssetCard from "./AssetCard"

const AssetList = ({ assets, address, slug }) => {
  // infinite scroll using offset, assign response to assets object
  const [osAssets, setOsAssets] = React.useState([...assets])
  const [offset, setOffset] = React.useState(48)
  const [fetchAssets, setFetchAssets] = React.useState(false)
  const [collectionComplete, setCollectionComplete] = React.useState(false)

  const [ref, isVisible] = useInView(
    {
      onEnter: () => handleLoadMore(),
    },
    []
  )

  let req = {
    slug: slug,
    address: address,
    offset: offset,
  }

  const { data, isLoading, refetch } = useQuery(
    ["osAssets", slug],
    () => api.getOsAssets(req),
    {
      enabled: !!fetchAssets,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      onSuccess: async data => {
        const newAssets = await data?.assets
        if (!newAssets.length) {
          setCollectionComplete(true)
          return
        }
        setOsAssets([...osAssets, ...newAssets])
        setFetchAssets(false)
      },
    }
  )

  const handleLoadMore = () => {
    if (collectionComplete) {
      return
    }
    setFetchAssets(true)
    setOffset(offset => (offset += 48))
    refetch()
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className=" grid w-full grid-cols-1 justify-items-center gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
        {osAssets.map((asset, index) => (
          <AssetCard key={index} asset={asset} />
        ))}
      </div>
      {!collectionComplete ? (
        <button
          className="mt-10 flex w-full flex-col items-center justify-center"
          ref={ref}
          onClick={handleLoadMore}
        >
          <div className="motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
            <img alt="" src="/babydao.png" width={80} height={80} />
          </div>
          <span>loading...</span>
        </button>
      ) : (
        <></>
      )}
    </div>
  )
}

export default AssetList
