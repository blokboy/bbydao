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
    let list = []
    if (friendData) {
      for (const friend of friendData) {
        // relationship status = 4 (follower)
        // & the address of the profile being viewed is not the initiator of the relationship
        if (friend.status === 4 && friend.initiator !== address) {
          list.push(friend)
        } else {
          null
        }
      }
    }
    return list
  }, [friendData])


  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex flex-row space-x-2">
        <UserFollowers address={address} numFollowers={parsedList?.length} followers={parsedList} friendStatus={friendStatus} />
      </div>
      {user === address ? null : <FollowUserBtn user={user} address={address} friendStatus={friendStatus} />}
    </div>
  )
}

export default UserFollow
