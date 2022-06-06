import Link from "next/link"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime.ts"
import { HiCheckCircle } from "react-icons/hi"

const PendingTxCard = ({ tx }) => {
  console.log("tx", tx)
  const { formattedDate, timeFromNow } = useRelativeTime()
  const { transaction } = tx
  const { to } = transaction?.txInfo

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.timestamp || tx?.transaction?.timestamp)
  }, [tx.timestamp, tx?.transaction?.timestamp, timeFromNow])

  const status = React.useMemo(() => {
    return transaction?.txStatus === "SUCCESS" ? <HiCheckCircle size={28} /> : null
  }, [transaction])

  return (
    <div className="mb-4 flex flex-col space-x-2 rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <div className="ml-auto text-xs font-thin">{txTimeFromNow}</div>
      <div>{transaction?.txInfo?.methodName || transaction?.txInfo?.dataDecoded?.method}</div>
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-2 h-6 w-6 overflow-hidden rounded-full">
            <img src={to?.logoUri} />
          </div>
          <div className="font-thin">{to?.name}</div>
        </div>
        <div className="mt-4 text-xs font-thin">
          <div className="flex items-center">
            Required Signatures:{" "}
            <span className="max-w-4 ml-2 flex h-4 max-h-4 w-4 items-center justify-center rounded-full p-4 text-lg dark:bg-slate-700">
              {transaction?.executionInfo?.confirmationsRequired}
            </span>
          </div>
          <div className="flex items-center">
            Total Signatures:{" "}
            <span className="max-w-4 ml-2 flex h-4 max-h-4 w-4 items-center justify-center rounded-full p-4 text-lg dark:bg-slate-700">
              {transaction?.executionInfo?.confirmationsSubmitted}
            </span>
          </div>
        </div>
        <div>{transaction?.txStatus}</div>
      </div>
    </div>
  )
}

export default PendingTxCard
