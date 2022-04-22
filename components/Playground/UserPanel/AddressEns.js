import React from "react"
import { BiCopy } from "react-icons/bi"
import { useEnsLookup } from "wagmi"

const AddressEns = ({ address }) => {
  const [{ data: ensData, error: ensError, loading: ensLoading }, lookupAddress] = useEnsLookup({
    address: address,
  })

  if (ensLoading || !address) {
    return (
      <div className="flex h-10 w-full animate-pulse justify-center rounded-xl bg-slate-200 dark:bg-slate-800"></div>
    )
  }

  return (
    <div className="flex h-10 w-full flex-row items-center justify-center space-x-1">
      <div className={ensData && ensData.length > 18 ? "text-md" : "text-xl"}>
        {ensData ? ensData : address.substring(0, 6) + "..." + address.substring(address.length - 4)}
      </div>
      <button className="flex flex-row space-x-1 rounded-full border bg-slate-200 p-2 text-xs hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-300 dark:hover:bg-slate-700">
        <BiCopy size={16} />
      </button>
    </div>
  )
}

export default AddressEns
