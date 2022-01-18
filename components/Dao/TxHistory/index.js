import React from "react"
import PendingTxs from "./PendingTxs"
import AllTxs from "./AllTxs"

const TxHistory = ({ allTxs, incomingTxs, pendingTxs }) => {
  console.log("TxHistory allTxs", allTxs)
  console.log("TxHistory incomingTxs", incomingTxs)
  console.log("TxHistory pendingTxs", pendingTxs)

  return (
    <div className="flex flex-col mx-auto rounded-xl shadow-xl w-full px-4 pt-6 pb-8 mb-3 bg-slate-200 dark:bg-slate-900">
      {/* pre sig transactions - awaiting threshold sigs*/}
      {/* <PendingTxs pendingTxs={pendingTxs} /> */}
      {/* post sig transactions - ready to execute*/}
      <AllTxs allTxs={allTxs} />
    </div>
  )
}

export default TxHistory
