import React from "react"
import { useAccount, useEnsLookup } from "wagmi"

const UserFeedCard = () => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const [
    { data: ensData, error: ensError, loading: ensLoading },
    lookupAddress,
  ] = useEnsLookup({
    address: data?.address,
  })

  if (!data) return null

  return (
    <div className="w-5/6 my-2 cursor-pointer rounded-full border border-blue-100 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text px-4 py-2 font-semibold text-transparent shadow">
      Test content change to see if width is dynamic
    </div>
  )
}

export default UserFeedCard