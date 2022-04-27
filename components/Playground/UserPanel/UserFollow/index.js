import React from "react"
import UserFollowers from "./UserFollowers"
import FollowUserBtn from "./FollowUserBtn"

import useFriendData from "hooks/useFriendData"

// user and address are passed down from the index Playground component
// user is the address of the signed-in user (from wagmi)
// address is the address of the profile being viewed
const UserFollow = ({ user, address }) => {
  // determine relationship of user to address
  const [friendData, { friendStatus }] = useFriendData(address)

  const parsedList = React.useMemo(() => {
    let list = {
      friends: [],
      following: [],
    }

    if (friendData) {
      for (const friend of friendData) {
        if (friend.status === 4) {
          list.following.push(friend)
        } else {
          list.friends.push(friend)
        }
      }
    }

    return list
  }, [friendData])

  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <UserFollowers numFollowers={parsedList?.following?.length} />
      {user === address ? null : <FollowUserBtn user={user} address={address} friendStatus={friendStatus} />}
    </div>
  )
}

export default UserFollow
