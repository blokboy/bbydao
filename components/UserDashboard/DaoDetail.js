import React from "react"
import Link from "next/link"
import Davatar from "@davatar/react"

const DaoDetail = ({ safe }) => {
  if (!safe) {
    return <></>
  }

  return (
    <>
      <Link href={safe ? `/dao/${safe}` : "/"}>
        <a>
          <div className="flex flex-col text-center">
            <Davatar size={175} address={safe} generatedAvatarType="blockies" />
            <span className="mt-2 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-sm text-transparent">
              {safe.substring(0, 12) + "..."}
            </span>
          </div>
        </a>
      </Link>
    </>
  )
}

export default DaoDetail
