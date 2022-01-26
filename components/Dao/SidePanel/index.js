import React from "react"
import MemberCard from "./MemberCard"

const SidePanel = ({ safeInfo, nftImage }) => {
  return (
    <div className="flex-start mx-1 mb-3 flex h-full flex-row px-4 md:flex-col">
      <div className="w-1/2 md:w-full">
        <div className="flex place-content-center">
          {nftImage ? <img src={nftImage} alt="alt" width={200} /> : <></>}
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h1 className="mt-3">dao address</h1>
          <span className="bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-2xl font-semibold text-transparent">
            {safeInfo.address.substring(0, 6) +
              "..." +
              safeInfo.address.substring(
                safeInfo.address.length - 5,
                safeInfo.address.length - 1
              )}
          </span>
        </div>
      </div>

      {/* make component to represent these (with pics) */}
      {/* modal pops to center of screen to scroll through all members */}
      <div className="h-fit w-1/2 md:h-2/5 md:w-full">
        <h1>members</h1>
        <div className="h-72 overflow-auto p-1">
          {safeInfo.owners.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SidePanel
