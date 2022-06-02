import React from "react"
import UserFollowers from "./UserFollowers"
import FollowUserBtn from "./FollowUserBtn"
import { useQuery } from "react-query"
import * as api from "query"

// user and address are passed down from the index Playground component
// user is the address of the signed-in user (from wagmi)
// address is the address of the profile being viewed
const UserFollow = ({ user, address }) => {
  const { data: followers } = useQuery(["userFollowers", address], () => api.getFollowers({ target: address }), {
    refetchOnWindowFocus: false,
    staleTime: 180000,
  })

  // followerArr
  // take each initiator field from the objects in the followers array, and push them into a new array
  const followerArr = React.useMemo(() => {
    const arr = followers?.map(follower => follower.initiator)
    return arr
  }, [followers])

  // boolean value based on if user (signed-in user) is in the followers array of the profile being viewed
  const isFollowing = React.useMemo(() => {
    if (!followers) {
      return false
    }
    const isFollowing = followers.find(follower => follower.initiator === user)
    return isFollowing ? isFollowing.id : false
  }, [followerArr, user])

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex flex-row space-x-2">
        <UserFollowers
          address={address}
          numFollowers={followers?.length}
          followers={followers}
          isFollowing={isFollowing}
        />
      </div>
      {user === address ? null : <FollowUserBtn user={user} address={address} isFollowing={isFollowing} />}
    </div>
  )
}

export default UserFollow
