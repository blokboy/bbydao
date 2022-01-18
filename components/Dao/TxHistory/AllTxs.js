import React from "react"
import { ethers } from "ethers"
import Davatar from "@davatar/react"

const AllTxs = ({ allTxs, threshold }) => {
  console.log("AllTxs", allTxs)

  // sign
  // reject

  /* EXECUTE (needs Safe object)
  const execute = async () => {
    await window.ethereum.enable()
    await window.ethereum.request({ method: "eth_requestAccounts" })

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(provider.provider.selectedAddress)

    const ethAdapter = new EthersAdapter({ ethers, signer })
    const safeSdk2 = await safeSdk.connect({
      ethAdapter,
      safeAddress: safeAddress,
    })
    // await safeSdk2.executeTransaction(safeTransaction)
  }
  */

  return (
    <div className="w-fit">
      <h1 className="mt-4">All Transactions: {allTxs.count}</h1>
      <div className="flex flex-col rounded-lg shadow-inner mt-1 bg-slate-100 dark:bg-slate-800 p-1">
        {/* Txs */}
        {allTxs.results.map((tx, index) => (
          <div
            key={index}
            className="flex flex-row m-1 rounded-lg shadow bg-slate-300 dark:bg-slate-900 items-center p-2 justify-between"
          >
            {/* tx data */}
            <div className="flex flex-row">
              {tx.confirmations[0]?.owner ? (
                <div className="w-6 h-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800 mr-1">
                  <Davatar
                    size={22}
                    address={tx.confirmations[0].owner}
                    generatedAvatarType="blockies"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800 mr-1"></div>
              )}
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

              <span>/</span>

              {/* tx rejections */}
              <ul className="flex flex-row px-1 w-14">
                <li className="w-6 h-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></li>
                <li className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></li>
                <li className="w-6 h-6 rounded-full border border-white -ml-3 bg-slate-200 dark:bg-slate-900"></li>
              </ul>
            </div>

            {/* approve, reject, execute tx actions */}
            <div className="flex flex-row justify-end px-1 w-28">
              {tx.isExecuted ? (
                <>
                  {/* <span className="bg-blue-400 rounded-lg shadow-sm p-1 text-xs mr-1">
                    executed
                  </span> */}
                  <div className="rounded-full border border-white bg-slate-200 dark:bg-slate-900">
                    <Davatar
                      size={22}
                      address={tx.executor}
                      generatedAvatarType="blockies"
                    />
                  </div>
                </>
              ) : tx.confirmations.length >= threshold ? (
                <button className="bg-blue-400 rounded-lg shadow-sm p-1 text-xs mr-1">
                  execute
                </button>
              ) : (
                <>
                  <button className="bg-red-400 rounded-lg shadow-sm p-1 text-xs mr-1">
                    reject
                  </button>
                  <button className="bg-green-400 rounded-lg shadow-sm p-1 text-xs">
                    approve
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllTxs
