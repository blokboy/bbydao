import React from "react"
import { useBalance } from "wagmi"

const Graph = ({ safeAddress }) => {
  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: safeAddress,
  })
  return (
    <div className="flex flex-col mx-auto rounded-xl shadow-xl w-full px-4 pt-6 pb-8 mb-3 bg-slate-200 dark:bg-slate-900">
      <div className="flex flex-row w-full justify-between">
        <h1>BALANCE: </h1>
        <h1 className="text-green-500"> {balanceData?.formatted} ETH</h1>
      </div>
    </div>
  )
}

export default Graph
