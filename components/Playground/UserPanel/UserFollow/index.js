import React from "react"
import UserFollowers from "./UserFollowers"
import FollowUserBtn from "./FollowUserBtn"

// user and address are passed down from the index Playground component
// user is the address of the signed-in user (from wagmi)
// address is the address of the profile being viewed
const UserFollow = ({ user, address }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <UserFollowers />
      {user === address ? null : <FollowUserBtn user={user} address={address} />}
    </div>
  )
}

export default UserFollow
