import React from "react"
import { useOsStore } from "stores/useOsStore"

const NftCard = ({ nft }) => {
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

  return (
    <div className="flex flex-col items-center">
      <img className="p-3" src={nft.imageUri} alt="" />
      <button
        className="w-1/2 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
        onClick={handleClick}
      >
        sell
      </button>
    </div>
  )
}

export default NftCard
