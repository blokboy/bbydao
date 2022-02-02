import React from "react"
import { ethers } from "ethers"
import Davatar from "@davatar/react"
import ApproveRejectTx from "./ApproveRejectTx"
import ExecuteTx from "./ExecuteTx"
import { useAccount } from "wagmi"

const AllTxs = ({ allTxs, owners, threshold }) => {
  console.log("AllTxs", allTxs)
  const [{ data, error, loading }, disconnect] = useAccount()

  console.log(data?.address)

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
      <div className="mt-1 flex flex-col rounded-lg bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
        {/* Txs */}
        {allTxs.map((tx, index) => (
          <div
            key={index}
            className="m-1 flex flex-row items-center justify-between rounded-lg bg-slate-300 p-2 shadow dark:bg-slate-900"
          >
            {/* tx data */}
            <div className="flex flex-row">
              {tx.approvals ? (
                <div className="mr-1 h-6 w-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800">
                  {/* <Davatar
                    size={22}
                    address={tx.confirmations[0].owner}
                    generatedAvatarType="blockies"
                  /> */}
                </div>
              ) : (
                <div className="mr-1 h-6 w-6 rounded-full border border-white bg-slate-100 dark:bg-slate-800"></div>
              )}
              <span className="mr-1 flex w-20 flex-row justify-end rounded border border-white bg-slate-100 p-1 text-[12px] dark:bg-slate-800">
                <span>{ethers.utils.formatEther(tx.value).slice(0, 8)}</span>{" "}
                <span className="text-blue-500">ETH</span>
              </span>

              {/* render based on type */}
              <span className="p-1 text-[12px] font-semibold">to:</span>
              <span className="w-16 rounded border border-white bg-slate-100 p-1 text-[12px] text-yellow-500 dark:bg-slate-800">
                {/* {tx.to.slice(0, 6)}... */}
              </span>
            </div>

            {/* tx confirmations */}
            <div className="flex flex-row">
              <ul className="flex w-14 flex-row justify-end px-1">
                {tx.approvals?.map((conf, index) => (
                  <li
                    key={index}
                    className={
                      "rounded-full border border-white bg-slate-200 dark:bg-slate-900" +
                      (index === 0 ? " ml-0" : " -ml-3")
                    }
                  >
                    <li className="h-6 w-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></li>
                    {/* <Davatar
                      size={22}
                      address={conf}
                      generatedAvatarType="blockies"
                    /> */}
                  </li>
                ))}
              </ul>

              <span></span>

              {/* tx rejections */}
              <ul className="flex w-14 flex-row px-1">
                <li className="h-6 w-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></li>
                <li className="-ml-3 h-6 w-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></li>
                <li className="-ml-3 h-6 w-6 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></li>
              </ul>
            </div>

            {/* approve, reject, execute tx actions */}
            <div className="flex w-28 flex-row justify-end px-1">
              {data &&
              owners?.includes(data?.address) &&
              tx.approvals?.length >= threshold ? (
                <ExecuteTx tx={tx} address={data?.address} />
              ) : data &&
                owners?.includes(data?.address) &&
                !tx?.approvals?.includes(data?.address) ? (
                <ApproveRejectTx tx={tx} address={data?.address} />
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllTxs
