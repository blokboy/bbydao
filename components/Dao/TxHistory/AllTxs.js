import React from "react"
import { ethers } from "ethers"

const AllTxs = ({ allTxs }) => {
  console.log("AllTxs", allTxs)
  return (
    <>
      <div className="flex flex-col rounded-lg shadow-inner mt-4 bg-slate-100 dark:bg-slate-800 p-2">
        <h1>All Transactions: {allTxs.count}</h1>
        {allTxs.results.map((tx, index) => (
          <div key={index} className="flex flex-row">
            <span className="text-sm text-blue-500 mr-2">{tx.blockNumber}</span>
            {tx.isExecuted ? (
              <span className="text-sm text-green-500 ml-2">
                {ethers.utils.formatEther(tx.value)} ETH
              </span>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default AllTxs
