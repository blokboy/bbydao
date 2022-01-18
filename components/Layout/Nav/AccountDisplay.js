import React from "react"
import { useAccount } from "wagmi"

const AccountDisplay = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  if (!data) return

  return (
    <div className="flex flex-row mr-3 rounded-full border border-blue-100 shadow font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] px-4 py-2 w-max">
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
