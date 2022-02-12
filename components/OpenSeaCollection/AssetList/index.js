import React from "react"
import * as api from "query"
import { useQuery } from "react-query"
import AssetCard from "./AssetCard"

const AssetList = ({ assets, address, slug }) => {
  // infinite scroll using offset, assign response to assets object
  const [osAssets, setOsAssets] = React.useState([...assets])
  const [offset, setOffset] = React.useState(48)
  const [fetchAssets, setFetchAssets] = React.useState(false)

  let req = {
    slug: slug,
    address: address,
    offset: offset,
  }

  const { data, refetch } = useQuery(
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
        if (!newAssets.length) return
        setOsAssets([...osAssets, ...newAssets])
        setFetchAssets(false)
      },
    }
  )

  const handleLoadMore = () => {
    setFetchAssets(true)
    setOffset(offset => (offset += 48))
    refetch()
  }

  return (
    <div className="mx-4 grid w-full grid-cols-1 justify-items-center gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
      {osAssets.map((asset, index) => (
        <AssetCard key={index} asset={asset} />
      ))}
      <button onClick={handleLoadMore}>load more</button>
    </div>
  )
}

export default AssetList
