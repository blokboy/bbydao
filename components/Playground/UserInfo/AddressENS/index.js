import React from "react"
import { useEnsLookup } from "wagmi"

const AddressENS = ({ address }) => {
  const [{ data: ensData, error: ensError, loading: ensLoading }, lookupAddress] = useEnsLookup({
    address: address,
  })

  if (ensLoading || !address) {
    return <div className="flex w-full justify-center animate-pulse">loading</div>
  }

  return (
    <div className="flex w-full justify-center text-lg">
      {ensData ? ensData : address.substring(0, 6) + "..." + address.substring(address.length - 4)}
    </div>
  )
}

export default AddressENS
