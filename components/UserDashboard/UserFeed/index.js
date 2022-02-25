import React from "react"
import { useAccount } from "wagmi"

const UserFeed = ({ address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  return (
  <div>
    <h1 className="text-xl font-bold underline">
        {data?.address === address ? "my feed" : "user feed"}
    </h1>
  </div>
  )
}

export default UserFeed
