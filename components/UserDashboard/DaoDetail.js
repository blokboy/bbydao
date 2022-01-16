import React from "react"
import Link from "next/link"
import Davatar from "@davatar/react"

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
            <Davatar
              size={175}
              address={safe}
              generatedAvatarType="blockies" // optional, 'jazzicon' or 'blockies'
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
