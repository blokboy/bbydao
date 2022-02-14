import React from "react"
import { useAccount, useEnsLookup } from "wagmi"

const AccountDisplay = () => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const [
    { data: ensData, error: ensError, loading: ensLoading },
    lookupAddress,
  ] = useEnsLookup({
    address: data?.address,
  })

  if (!data) return

  return (
    <div className="mr-3 flex w-max flex-row rounded-full border border-blue-100 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text px-4 py-2 font-semibold text-transparent shadow md:w-min">
      {ensData ? (
        ensData
      ) : !ensData && data?.address ? (
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
