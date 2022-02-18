import React from "react"
import MemberCard from "./MemberCard"

const SidePanel = ({ safeInfo, nftImage }) => {
  return (
    <div className="flex-start mx-1 mb-3 flex h-full flex-col px-4 md:flex-col">
      <div className="mb-3 flex place-content-center">
        {nftImage ? <img src={nftImage} alt="alt" width={200} /> : <></>}
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h1 className="">dao address</h1>
        <span className="mb-3 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-2xl font-semibold text-transparent">
          {safeInfo.address.substring(0, 6) +
            "..." +
            safeInfo.address.substring(
              safeInfo.address.length - 5,
              safeInfo.address.length - 1
            )}
        </span>
      </div>

      {/* make component to represent these (with pics) */}
      {/* modal pops to center of screen to scroll through all members */}
      <h1>members</h1>
      <div className="h-72 overflow-auto p-1">
        {safeInfo.owners.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  )
}

export default SidePanel
