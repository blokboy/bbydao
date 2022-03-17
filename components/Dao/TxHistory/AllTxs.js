import React from "react"
import { useAccount } from "wagmi"
import FriendTransaction from "./FriendTransaction"
import TransferTransaction from "./TransferTransaction"

const AllTxs = ({ allTxs, owners, threshold }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  return (
    <div className="w-full">
      <h1 className="mt-4">All Transactions: {allTxs.count}</h1>
      <div className="flex flex-col rounded-lg bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
        {/* Txs */}
        {allTxs.map((tx, index) => {
          if (tx.type === 6) {
            return (
              <FriendTransaction
                key={index}
                tx={tx}
                owners={owners}
                threshold={threshold}
              />
            )
          }

          if (tx.type === 4) {
            return (
              <TransferTransaction
                key={index}
                tx={tx}
                owners={owners}
                threshold={threshold}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

export default AllTxs
