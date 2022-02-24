import React from "react"
import { useBalance } from "wagmi"

const Graph = ({ safeAddress }) => {
  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: safeAddress,
  })
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <div className="flex w-full flex-row justify-between">
        <h1>BALANCE: </h1>
        <h1 className="text-green-500"> {balanceData?.formatted} ETH</h1>
      </div>
    </div>
  )
}

export default Graph
