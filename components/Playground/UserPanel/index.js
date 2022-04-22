import React from "react"
import Pfp from "./Pfp"
import AddressEns from "./AddressEns"
import UserFollow from "./UserFollow"

const UserPanel = ({ address }) => {
  return (
    <div className="flex w-full flex-col lg:w-1/5 p-3 space-y-3">
      <Pfp />
      <AddressEns address={address}/>
      <UserFollow />
    </div>
  )
}

export default UserPanel
