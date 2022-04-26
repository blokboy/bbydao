import React from "react"
import Pfp from "./Pfp"
import AddressEns from "./AddressEns"
import UserFollow from "./UserFollow"

import useFriendData from "hooks/useFriendData"

const UserPanel = ({ user, address }) => {
  // determine relationship of user to address
  const [friendData, { friendStatus, refetch }, friendActionText] = useFriendData(address)
  console.log('UserPanel friendData:', friendData)
  console.log('UserPanel friendStatus:', friendStatus)

  return (
    <div className="flex w-full flex-col lg:w-1/5 p-3 space-y-3">
      <Pfp />
      <AddressEns address={address}/>
      <UserFollow user={user} address={address} />
    </div>
  )
}

export default UserPanel
