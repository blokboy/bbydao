import React from "react"
import { BiCopy } from "react-icons/bi"
import { useEnsName } from "wagmi"

const AddressEns = ({ address }) => {
  const { data: ensData, isError: ensError, isLoading: ensLoading } = useEnsName({
    address: address,
  })

  const [copyToast, setCopyToast] = React.useState(false)
  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(address)
    if (!copyToast) {
      setCopyToast(true)
    }
    setTimeout(() => setCopyToast(false), 3000)
  }, [address])

  const toast = React.useMemo(() => {
    return copyToast ? (
      <div className="absolute -translate-y-9 rounded-xl border border-green-600 bg-slate-200 p-1.5 text-xs text-green-600 dark:border-green-300 dark:bg-slate-800 dark:text-green-300">
        copied to clipboard!
      </div>
    ) : null
  }, [copyToast])

  if (ensLoading || !address) {
    return (
      <div className="flex h-10 w-full flex-row items-center justify-center">
        <div className="flex h-full w-44 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="flex h-10 w-full flex-row items-center justify-center space-x-1">
      <div className={ensData && ensData.length > 18 ? "text-md" : "text-xl"}>
        {ensData ? ensData : address.substring(0, 6) + "..." + address.substring(address.length - 4)}
      </div>
      {toast}
      <button
        className="flex flex-row space-x-1 rounded-full border bg-slate-200 p-2 text-xs hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-300 dark:hover:bg-slate-700"
        onClick={copyToClipboard}
      >
        <BiCopy size={16} />
      </button>
    </div>
  )
}

export default AddressEns
