import React from "react"
import { useBalance } from "wagmi"

const Graph = ({ safeAddress }) => {
  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: safeAddress,
  })
  return (
    <div className="flex flex-col mx-auto rounded shadow-xl w-full md:rounded-xl px-8 pt-6 pb-8 mb-3 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-row w-3/5 justify-between">
        <h1>BALANCE: </h1>
        <h1 className="text-green-500"> {balanceData?.formatted} ETH</h1>
      </div>
    </div>
  )
}

export default Graph
