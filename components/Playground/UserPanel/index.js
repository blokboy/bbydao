import React from "react"
import Pfp from "./Pfp"
import AddressEns from "./AddressEns"
import UserFollow from "./UserFollow"
import CreateBbyDaoBtn from "./CreateBbyDaoBtn"

const UserPanel = ({ user, address }) => {
  return (
    <div className="flex h-full w-full flex-col space-y-3 p-3 lg:sticky lg:top-16 lg:w-1/5">
      <Pfp address={address} />
      <AddressEns address={address} />
      <UserFollow user={user} address={address} />
      {user === address ? <CreateBbyDaoBtn /> : null}
    </div>
  )
}

export default UserPanel
