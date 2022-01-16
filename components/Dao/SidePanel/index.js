import React from "react"
import Image from "next/image"
import Link from "next/link"
import Avatar from "boring-avatars"

const SidePanel = ({ safeInfo, nftImage }) => {
  console.log("SidePanel safeInfo", safeInfo)

  return (
    <div className="flex flex-col flex-start md:w-2/12 px-4">
      <div className="w-1/2 md:w-full">
        <img src={nftImage} alt="alt" width={200} />
      </div>
      <h1 className="mt-3">safe address</h1>
      <div>
        <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]">
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
      <h1 className="mt-3">members</h1>
      {safeInfo.owners.map((owner, index) => (
        <Link key={index} href={`/user/${owner}`}>
          <a className="flex flex-row items-center">
            <Avatar
              size={"2rem"}
              name={`${owner}`}
              variant="pixel"
              colors={["#0DB2AC", "#F5DD7E", "#FC8D4D", "#FC694D", "#FABA32"]}
            />
            <span className="text-sm p-3">
              {owner.substring(0, 6) +
                "..." +
                owner.substring(owner.length - 5, owner.length - 1)}
            </span>
          </a>
        </Link>
      ))}
    </div>
  )
}

export default SidePanel
