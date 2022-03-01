import React from "react"
import { useBalance } from "wagmi"
import { useUiStore } from "stores/useUiStore"

const Graph = ({ safeAddress }) => {
  const setTxModalOpen = useUiStore(state => state.setTxModalOpen)

  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: safeAddress,
  })
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <div className="flex w-full flex-row justify-between">
        <h1>BALANCE: </h1>
        <h1 className="text-green-500"> {balanceData?.formatted} ETH</h1>
      </div>
      {/* check to make sure connected wallet is a part of the safe */}
      <div className="flex w-full flex-row justify-center p-3">
        <button
          className="w-1/2 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
          onClick={setTxModalOpen}
        >
          transfer
        </button>
      </div>
    </div>
  )
}

export default Graph
