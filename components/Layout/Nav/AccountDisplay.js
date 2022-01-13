import React from "react"
import { useAccount } from "wagmi"

const AccountDisplay = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  if (!data) return

  return (
    <div className="hidden md:flex flex-row mr-3 rounded-full border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 px-4 py-2 w-max">
      {data?.address ? (
        data.address.substring(0, 6) +
        "..." +
        data.address.substring(data.address.length - 5, data.address.length - 1)
      ) : (
        <></>
      )}
    </div>
  )
}

export default AccountDisplay
