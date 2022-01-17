import React from "react"
import Image from "next/image"
import Link from "next/link"
import Davatar from "@davatar/react"
import MemberCard from "./MemberCard"

const SidePanel = ({ safeInfo, nftImage }) => {
  console.log("SidePanel safeInfo", safeInfo)

  return (
    <div className="flex flex-row md:flex-col flex-start mx-1 mb-3 px-4">
      <div className="flex w-1/2 md:w-full place-content-center">
        <img src={nftImage} alt="alt" width={200} />
      </div>
      <div className="w-1/2 md:w-full">
        <h1 className="mt-3">safe address</h1>
        <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]">
          {safeInfo.address.substring(0, 6) +
            "..." +
            safeInfo.address.substring(
              safeInfo.address.length - 5,
              safeInfo.address.length - 1
            )}
        </span>

        {/* make component to represent these (with pics) */}
        {/* modal pops to center of screen to scroll through all members */}
        <h1 className="mt-3">members</h1>
        {safeInfo.owners.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  )
}

export default SidePanel
