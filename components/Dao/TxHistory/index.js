import React from "react"
import PendingTxs from "./PendingTxs"
import AllTxs from "./AllTxs"

const TxHistory = ({ allTxs, owners, threshold }) => {
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      {/* pre sig transactions - awaiting threshold sigs*/}
      {/* <PendingTxs pendingTxs={pendingTxs} /> */}
      {/* post sig transactions - ready to execute*/}
      <AllTxs allTxs={allTxs} owners={owners} threshold={threshold} />
    </div>
  )
}

export default TxHistory
