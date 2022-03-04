import React from "react"
import { useAccount } from "wagmi"
import { useQuery, useMutate } from "react-query"
import UserFeedCard from "./UserFeedCard"
import * as api from "../../../query"

const UserFeed = ({ address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const { data: friendData } = useQuery(
    ["friends", address],
    () => api.getFriends({ initiator: address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const following = []

  if (friendData) {
    for (const friend of friendData) {
      if (friend.status === 4) {
        following.push(friend.target)
      }
    }
  }

  const { data: followData } = useQuery(
    ["friends", following],
    () => api.getUserFeed(following),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )
  console.log("following ", followData)

  return (
    <div className="flex flex-col p-3">
      <h1 className="text-xl font-bold underline">
        {data?.address === address ? "my feed" : "user feed"}
      </h1>

      {followData?.length ? (
        followData.map(async (follower, index) => {
          return <UserFeedCard key={index} follower={follower} />
        })
      ) : (
        <span className="align-center flex rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] dark:bg-slate-900 dark:hover:bg-opacity-75">
          Follow bbyDAOs to populate your feed!
        </span>
      )}
    </div>
  )
}

export default UserFeed
