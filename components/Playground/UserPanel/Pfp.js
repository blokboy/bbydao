import React from "react"
import Davatar from "@davatar/react"

const Pfp = ({address}) => {
  return (
    <div className="flex flex-row w-full justify-center">
      <div className="flex items-center justify-center rounded-full h-36 w-36 overflow-clip border border-white">
        <Davatar size={175} address={address} generatedAvatarType="blockies" />
      </div>
    </div>
  )
}

export default Pfp
