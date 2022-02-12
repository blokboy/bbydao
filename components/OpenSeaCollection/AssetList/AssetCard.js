import React from "react"
import { ethers } from "ethers"
import { useOsStore } from "stores/useOsStore"

const AssetCard = ({ asset }) => {
  const setOsOfferModalOpen = useOsStore(state => state.setOsOfferModalOpen)
  const setOsAssetInfo = useOsStore(state => state.setOsAssetInfo)
  const setOsBuyModalOpen = useOsStore(state => state.setOsBuyModalOpen)

  const offerModal = () => {
    setOsOfferModalOpen()
    setOsAssetInfo({
      address: asset.address,
      token_id: asset.token_id,
      image_url: asset.image_url,
      sellOrder: null,
    })
  }

  const buyModal = () => {
    setOsBuyModalOpen()
    setOsAssetInfo({
      address: asset.address,
      token_id: asset.token_id,
      image_url: asset.image_url,
      sellOrder: asset.sell_orders?.[0].current_price || null,
    })
  }

  return (
    <div className="flex w-full flex-col rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
      <div className="flex flex-row justify-between">
        {/* asset name & number of sales */}
        <span className="text-xs font-bold">{asset?.name}</span>
        <span className="text-xs font-semibold">
          {asset?.last_sale
            ? `Last Sale: ${ethers.utils.formatEther(asset?.last_sale)} ETH`
            : "diamond"}
        </span>
      </div>
      {/* asset img */}
      <img src={asset?.image_url} alt="" />
      <span className="text-sm font-bold">{asset?.name}</span>
      <div className="mt-2 flex flex-row justify-between">
        <div className="flex flex-row">
          {/* owner address */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold">owner:</span>
            <span className="bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text font-semibold text-transparent">
              {asset?.owner.substring(0, 6) +
                "..." +
                asset?.owner.substring(
                  asset?.owner.length - 5,
                  asset?.owner.length - 1
                )}
            </span>
          </div>
        </div>
        {/* asset price */}
        <div className="mx-2 flex flex-col">
          <span className="text-xs font-semibold">price</span>
          <span className="text-sm font-semibold">
            {asset?.sell_orders
              ? asset?.sell_orders[0].current_price / 10 ** 18
              : "Not For Sale"}
          </span>
        </div>
      </div>
      <div className="mt-2 flex flex-row justify-between">
        {/* asset traits */}
        {/* <div className="grid grid-cols-3 gap-1">
          {asset.traits.map((trait, index) => (
            <div
              key={index}
              className="h-5 w-5 rounded-full bg-slate-300 p-[3px] dark:bg-slate-700"
            ></div>
          ))}
        </div> */}
        {/* traits rarity score */}
        {/* <span className="text-sm font-semibold">rarity score</span> */}
      </div>
      {/* buy offer buttons */}
      <div className="mt-2 flex flex-row justify-center">
        {asset?.sell_orders ? (
          <button
            onClick={buyModal}
            className="mx-1 rounded bg-slate-200 p-2 font-semibold shadow dark:bg-slate-900"
          >
            buy
          </button>
        ) : (
          <></>
        )}
        <button
          onClick={offerModal}
          className="mx-1 rounded bg-slate-200 p-2 font-semibold shadow dark:bg-slate-900"
        >
          make offer
        </button>
      </div>
    </div>
  )
}

export default AssetCard
