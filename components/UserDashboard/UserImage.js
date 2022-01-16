import React from "react"
import Davatar from "@davatar/react"

const UserImage = ({ address }) => {
  return (
    <div className="flex w-full justify-center md:justify-start">
      <Davatar
        size={175}
        address={address}
        generatedAvatarType="blockies" // optional, 'jazzicon' or 'blockies'
      />
    </div>
  )
}

export default UserImage
