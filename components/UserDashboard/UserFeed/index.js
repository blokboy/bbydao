import React from "react"
import { useAccount } from "wagmi"
import UserFeedCard from "./UserFeedCard"

const UserFeed = ({ address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
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
