import React from "react"
import PendingTxs from "./PendingTxs"
import AllTxs from "./AllTxs"

const TxHistory = ({ allTxs, owners, threshold }) => {
  console.log("TxHistory allTxs", allTxs)
  // console.log("TxHistory pendingTxs", pendingTxs)

  return (
    <div className="mx-auto mb-3 flex w-1/2 flex-col items-center rounded-xl bg-slate-200 px-4 pt-6 pb-8 shadow-xl dark:bg-slate-900">
      {/* pre sig transactions - awaiting threshold sigs*/}
      {/* <PendingTxs pendingTxs={pendingTxs} /> */}
      {/* post sig transactions - ready to execute*/}
      <AllTxs allTxs={allTxs} owners={owners} threshold={threshold} />
    </div>
  )
}

export default TxHistory
