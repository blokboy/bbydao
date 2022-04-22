import React from "react"
import { BiCopy } from "react-icons/bi"
import { useEnsLookup } from "wagmi"

const AddressEns = ({ address }) => {
  const [{ data: ensData, error: ensError, loading: ensLoading }, lookupAddress] = useEnsLookup({
    address: address,
  })

  if (ensLoading || !address) {
    return <div className="flex w-full justify-center animate-pulse">loading</div>
  }

  return (
    <div className="flex flex-row space-x-1 items-center justify-center w-full">
      <div className="text-xl">{ensData ? ensData : address.substring(0, 6) + "..." + address.substring(address.length - 4)}</div>
      <button className="flex flex-row space-x-1 bg-slate-200 hover:border-teal-300 dark:bg-slate-800 dark:hover:bg-slate-700 border dark:border-slate-800 dark:hover:border-teal-300 text-xs p-2 rounded-full">
        <BiCopy size={16} />
        </button>
    </div>
  )
}

export default AddressEns
