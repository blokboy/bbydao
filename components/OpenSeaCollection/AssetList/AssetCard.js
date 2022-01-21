import React from "react"
import Davatar from "@davatar/react"

const AssetCard = ({ asset }) => {
  return (
    <div className="flex flex-col w-full border border-white rounded-xl p-3">
      <div className="flex flex-row justify-between">
        {/* asset name & number of sales */}
        <h1>{asset.name}</h1>
        <span>Sales: {asset.num_sales}</span>
      </div>
      {/* asset img */}
      <img src={asset.image_url} alt="" />
      <div className="flex flex-row justify-between mt-2">
        {/* owner avatar */}
        <Davatar
          size={40}
          address={asset.owner}
          generatedAvatarType="blockies"
        />
        {/* owner address */}
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]">
          {asset.owner.substring(0, 6) +
            "..." +
            asset.owner.substring(
              asset.owner.length - 5,
              asset.owner.length - 1
            )}
        </span>
        {/* asset price */}
        <span>asset price</span>
      </div>
      <div className="flex flex-row justify-between mt-2">
        {/* asset traits */}
        <div className="grid grid-cols-3 gap-1">
          {asset.traits.map((trait, index) => (
            <div
              key={index}
              className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-700"
            ></div>
          ))}
        </div>
      </div>
      {/* buy offer buttons */}
      <div className="flex flex-row justify-center mt-2">
        <button className="bg-slate-200 dark:bg-slate-800 p-3 rounded mx-1">
          buy
        </button>
        <button className="bg-slate-200 dark:bg-slate-800 p-3 rounded mx-1">
          offer
        </button>
      </div>
    </div>
  )
}

export default AssetCard
