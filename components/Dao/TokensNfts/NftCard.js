import React from "react"
import { useOsStore } from "stores/useOsStore"

export default function NftCard({ nft }) {
  const [isExpanded, setExpanded] = React.useState(false)

  const setOsSellModalOpen = useOsStore(state => state.setOsSellModalOpen)
  const setOsAssetInfo = useOsStore(state => state.setOsAssetInfo)

  const handleClick = e => {
    e.preventDefault()
    setOsAssetInfo({
      address: nft.address,
      token_id: nft.id,
      image_url: nft.imageUri,
      sellOrder: null,
    })
    setOsSellModalOpen(true)
  }

  const handleExpand = React.useCallback(() => {
    if (!isExpanded) {
      setExpanded(true)
    }
  }, [isExpanded])

  const handleCollapse = React.useCallback(() => {
    if (isExpanded) {
      setExpanded(false)
    }
  }, [isExpanded])

  const nftName = React.useMemo(() => {
    return (
      <div className="mt-2 pl-2 text-sm font-bold">
        {nft.name.length < 16 ? nft.name : `${nft.name.slice(0, 16)}...`}
      </div>
    )
  }, [nft.name])

  const nftContent = React.useMemo(() => {
    return isExpanded ? (
      <div className="flex flex-col items-center">
        <button type="button" onClick={handleCollapse}>
          <img className="p-3" src={nft.imageUri} alt="" />
        </button>
        <button
          className="w-1/2 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
          onClick={handleClick}
        >
          sell
        </button>
      </div>
    ) : (
      <div className="flex flex-col">
        <button type="button" onClick={handleExpand}>
          <img
            className="h-40 w-40 overflow-hidden rounded-xl bg-white object-contain shadow-lg"
            src={nft.imageUri}
            alt=""
          />
        </button>
        {nftName}
      </div>
    )
  }, [isExpanded])

  return <div className="w-1/2 flex justify-center mt-4 pt-4 pr-4 even:pr-0 lg:justify-start lg:w-auto lg:even:pr-4">{nftContent}</div>
}
