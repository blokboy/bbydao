import React from "react"
import { ethers } from "ethers"
import Davatar from "@davatar/react"

const PendingTxs = ({ pendingTxs, threshold }) => {
  // pendingTxs.results: []
  console.log("PendingTxs", pendingTxs)
  return (
    <div className="w-fit">
      <h1 className="mt-4">Pending Transactions: {pendingTxs.count}</h1>
      <div className="mt-1 flex flex-col rounded-lg bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
        {pendingTxs.results.map((tx, index) => (
          <div
            key={index}
            className="m-1 flex flex-row items-center justify-between rounded-lg bg-slate-300 p-2 shadow dark:bg-slate-900"
          >
            {/* tx data */}
            <div className="flex flex-row">
              <div className="mr-1 h-6 w-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800"></div>
              <span className="mr-1 flex w-20 flex-row justify-end rounded border border-white bg-slate-100 p-1 text-[12px] dark:bg-slate-800">
                <span>{ethers.utils.formatEther(tx.value).slice(0, 6)}</span>{" "}
                <span className="text-blue-500">ETH</span>
              </span>
              <span className="p-1 text-[12px] font-semibold">to:</span>
              <span className="w-16 rounded border border-white bg-slate-100 p-1 text-[12px] text-yellow-500 dark:bg-slate-800">
                {tx.to.slice(0, 6)}...
              </span>
            </div>

            {/* tx confirmations */}
            <div className="flex flex-row">
              <ul className="flex w-14 flex-row justify-end px-1">
                {tx.confirmations.map((conf, index) => (
                  <li
                    key={index}
                    className={
                      "rounded-full border border-white bg-slate-200 dark:bg-slate-900" +
                      (index === 0 ? " ml-0" : " -ml-3")
                    }
                  >
                    {/* <Davatar
                      size={22}
                      address={conf.owner}
                      generatedAvatarType="blockies"
                    /> */}
                  </li>
                ))}
              </ul>

              <span className="">/</span>

              {/* tx rejections */}
              <ul className="flex w-14 flex-row px-1">
                {/* <div className="w-6 h-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
                <div className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></div>
                <div className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></div> */}
              </ul>
            </div>

            {/* approve, reject, execute tx actions */}
            <div className="flex w-28 flex-row justify-end px-1">
              <button className="mr-1 rounded-lg bg-red-400 p-1 text-xs shadow-sm">
                reject
              </button>
              <button className="rounded-lg bg-green-400 p-1 text-xs shadow-sm">
                approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingTxs
