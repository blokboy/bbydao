import React from "react"
import Pfp from "./Pfp"
import AddressENS from "./AddressENS"

const UserInfo = ({ address }) => {
  return (
    <div className="flex w-full flex-col lg:w-1/5 p-3 space-y-3">
      <Pfp />
      <AddressENS address={address}/>
    </div>
  )
}

export default UserInfo
