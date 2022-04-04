import React from "react"
import { useBalance } from "wagmi"
import { useUiStore } from "stores/useUiStore"
import { HiAdjustments } from "react-icons/hi"
import CurrencyIconDropdown from "./CurrencyIconDropdown"

const Graph = ({ safeAddress }) => {
  const setTxModalOpen = useUiStore(state => state.setTxModalOpen)

  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: safeAddress,
  })

  return (
    <div className="mx-2 mb-3 flex flex-row items-end space-x-3 rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <div className="flex grow flex-row justify-between rounded-3xl border border-teal-300 bg-slate-100 p-3 dark:bg-slate-800">
        <div>
          <div className="flex flex-row justify-start">Net Worth</div>
          <div className="flex flex-row justify-start space-x-2">
            <div className="text-3xl font-bold">Ξ</div>
            <div className="text-3xl font-bold">
              {balanceData?.formatted.substring(0, 5)}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between space-y-2">
          <button className="icon-util-btn">
            <HiAdjustments size={18} />
          </button>
          <CurrencyIconDropdown />
        </div>
      </div>

      {/* check to make sure connected wallet is a part of the safe */}
      {/* <div className="flex w-full flex-row justify-center p-3">
        <button
          className="w-1/2 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
          onClick={setTxModalOpen}
        >
          transfer
        </button>
      </div> */}
    </div>
  )
}

export default Graph
