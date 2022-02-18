import React from "react"
import PendingTxs from "./PendingTxs"
import AllTxs from "./AllTxs"

const TxHistory = ({ allTxs, owners, threshold }) => {
  console.log("TxHistory allTxs", allTxs)
  // console.log("TxHistory pendingTxs", pendingTxs)

  return (
    <div className="flex flex-col rounded-xl bg-slate-200 shadow-xl dark:bg-slate-900">
      {/* pre sig transactions - awaiting threshold sigs*/}
      {/* <PendingTxs pendingTxs={pendingTxs} /> */}
      {/* post sig transactions - ready to execute*/}
      <AllTxs allTxs={allTxs} owners={owners} threshold={threshold} />
    </div>
  )
}

export default TxHistory
