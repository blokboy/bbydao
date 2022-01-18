import React from "react"
import { ethers } from "ethers"
import Davatar from "@davatar/react"

const PendingTxs = ({ pendingTxs, threshold }) => {
  // pendingTxs.results: []
  console.log("PendingTxs", pendingTxs)
  return (
    <div className="w-fit">
      <h1 className="mt-4">Pending Transactions: {pendingTxs.count}</h1>
      <div className="flex flex-col rounded-lg shadow-inner mt-1 bg-slate-100 dark:bg-slate-800 p-1">
        {pendingTxs.results.map((tx, index) => (
          <div
            key={index}
            className="flex flex-row m-1 rounded-lg shadow bg-slate-300 dark:bg-slate-900 items-center p-2 justify-between"
          >
            {/* tx data */}
            <div className="flex flex-row">
              <div className="w-6 h-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800 mr-1"></div>
              <span className="flex flex-row justify-end text-[12px] rounded border border-white bg-slate-100 dark:bg-slate-800 p-1 mr-1 w-20">
                <span>{ethers.utils.formatEther(tx.value).slice(0, 6)}</span>{" "}
                <span className="text-blue-500">ETH</span>
              </span>
              <span className="text-[12px] font-semibold p-1">to:</span>
              <span className="text-[12px] rounded border border-white p-1 text-yellow-500 bg-slate-100 dark:bg-slate-800 w-16">
                {tx.to.slice(0, 6)}...
              </span>
            </div>

            {/* tx confirmations */}
            <div className="flex flex-row">
              <ul className="flex flex-row justify-end px-1 w-14">
                {tx.confirmations.map((conf, index) => (
                  <li
                    key={index}
                    className={
                      "rounded-full border border-white bg-slate-200 dark:bg-slate-900" +
                      (index === 0 ? " ml-0" : " -ml-3")
                    }
                  >
                    <Davatar
                      size={22}
                      address={conf.owner}
                      generatedAvatarType="blockies"
                    />
                  </li>
                ))}
              </ul>

              <span className="">/</span>

              {/* tx rejections */}
              <ul className="flex flex-row px-1 w-14">
                {/* <div className="w-6 h-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
                <div className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></div>
                <div className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></div> */}
              </ul>
            </div>

            {/* approve, reject, execute tx actions */}
            <div className="flex flex-row justify-end px-1 w-28">
              <button className="bg-red-400 rounded-lg shadow-sm p-1 text-xs mr-1">
                reject
              </button>
              <button className="bg-green-400 rounded-lg shadow-sm p-1 text-xs">
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
