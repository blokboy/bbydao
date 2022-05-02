import React from 'react'
import Davatar from "@davatar/react"

const DaoPfp = ({address}) => {
  return (
    <div className="flex items-center justify-center rounded-full h-36 w-36 overflow-clip border border-white">
    <Davatar className="rounded-full" size={144} address={address} generatedAvatarType="blockies" />
  </div>
  )
}

export default DaoPfp