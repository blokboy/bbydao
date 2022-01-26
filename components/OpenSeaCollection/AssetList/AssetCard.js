import React from "react"
import Davatar from "@davatar/react"

const AssetCard = ({ asset }) => {
  return (
    <div className="flex w-full flex-col rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
      <div className="flex flex-row justify-between">
        {/* asset name & number of sales */}
        <h1>{asset.name}</h1>
        <span className="text-xs font-semibold">
          Sales: {asset.num_sales ? asset.num_sales : "0"}
        </span>
      </div>
      {/* asset img */}
      <img src={asset.image_url} alt="" />
      <div className="mt-2 flex flex-row justify-between">
        <div className="flex flex-row">
          {/* owner avatar */}
          <Davatar
            size={40}
            address={asset.owner}
            generatedAvatarType="blockies"
          />
          {/* owner address */}
          <div className="mx-2 flex flex-col">
            <span className="text-xs font-semibold">owner:</span>
            <span className="bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text font-semibold text-transparent">
              {asset.owner.substring(0, 6) +
                "..." +
                asset.owner.substring(
                  asset.owner.length - 5,
                  asset.owner.length - 1
                )}
            </span>
          </div>
        </div>
        {/* asset price */}
        <span className="text-sm font-semibold">asset price</span>
      </div>
      <div className="mt-2 flex flex-row justify-between">
        {/* asset traits */}
        <div className="grid grid-cols-3 gap-1">
          {asset.traits.map((trait, index) => (
            <div
              key={index}
              className="h-5 w-5 rounded-full bg-slate-300 p-[3px] dark:bg-slate-700"
            ></div>
          ))}
        </div>
        {/* traits rarity score */}
        <span className="text-sm font-semibold">rarity score</span>
      </div>
      {/* buy offer buttons */}
      <div className="mt-2 flex flex-row justify-center">
        <button className="mx-1 rounded bg-slate-200 p-2 font-semibold shadow dark:bg-slate-900">
          buy
        </button>
        <button className="mx-1 rounded bg-slate-200 p-2 font-semibold shadow dark:bg-slate-900">
          offer
        </button>
      </div>
    </div>
  )
}

export default AssetCard
