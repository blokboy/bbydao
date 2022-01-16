import React from "react"
import Link from "next/link"
import Avatar from "boring-avatars"

const DaoDetail = ({ safe }) => {
  if (!safe) {
    return <></>
  }

  console.log("dao detail", safe)

  return (
    <>
      <Link href={safe ? `/dao/${safe}` : "/"}>
        <a>
          <div className="flex flex-col text-center">
            <Avatar
              size={"9rem"}
              name={`${safe}`}
              variant="pixel"
              colors={["#0DB2AC", "#F5DD7E", "#FC8D4D", "#FC694D", "#FABA32"]}
            />
            {/* or collectible ? */}
            <span className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] mt-2">
              {safe.substring(0, 12) + "..."}
            </span>
          </div>
        </a>
      </Link>
    </>
  )
}

export default DaoDetail
