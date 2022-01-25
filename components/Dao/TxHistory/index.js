import React from "react"
import PendingTxs from "./PendingTxs"
import AllTxs from "./AllTxs"

const TxHistory = ({ allTxs, incomingTxs, pendingTxs, threshold }) => {
  console.log("TxHistory allTxs", allTxs)
  console.log("TxHistory incomingTxs", incomingTxs)
  console.log("TxHistory pendingTxs", pendingTxs)

  return (
    <div className="mb-3 flex w-max flex-col items-center rounded-xl bg-slate-200 px-4 pt-6 pb-8 shadow-xl dark:bg-slate-900">
      {/* pre sig transactions - awaiting threshold sigs*/}
      {/* <PendingTxs pendingTxs={pendingTxs} /> */}
      {/* post sig transactions - ready to execute*/}
      <AllTxs allTxs={allTxs} threshold={threshold} />
    </div>
  )
}

export default TxHistory
