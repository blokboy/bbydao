import React from "react"
import { useAccount } from "wagmi"
import { useQuery, useMutate } from "react-query"
import UserFeedCard from "./UserFeedCard"

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
  return (
  <div className="flex flex-col my-2">
    <h1 className="text-xl font-bold underline">
        {data?.address === address ? "my feed" : "user feed"}
    </h1>

    <UserFeedCard />
  </div>
  )
}

export default UserFeed
