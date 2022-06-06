import Link from "next/link"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime.ts"
import { HiCheckCircle } from "react-icons/hi"
import { useLayoutStore } from "../../../stores/useLayoutStore"

const PendingTxCard = ({ tx }) => {
  console.log("tx", tx)
  const { formattedDate, timeFromNow } = useRelativeTime()
  const { transaction } = tx
  const { to } = transaction?.txInfo
  const signer = useLayoutStore(state => state.signer)

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.timestamp || tx?.transaction?.timestamp)
  }, [tx.timestamp, tx?.transaction?.timestamp, timeFromNow])

  const status = React.useMemo(() => {
    return transaction?.txStatus === "SUCCESS" ? <HiCheckCircle size={28} /> : null
  }, [transaction])

  const isMissingSigner = React.useMemo(() => {
    return transaction?.executionInfo?.missingSigners?.filter(s => s.value === signer?._address).length > 0
  }, [signer, transaction])

  return (
    <div className="mb-4 flex flex-col space-x-2 rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <div className="ml-auto text-xs font-thin">{txTimeFromNow}</div>
      <div className="text-xs font-thin">Nonce: {transaction?.executionInfo?.nonce}</div>
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
      {isMissingSigner ? (
        <button className="mt-4 inline-flex items-center self-start rounded px-4 py-2 font-thin dark:bg-orange-600 dark:hover:bg-orange-700">
          Sign
        </button>
      ) : null}
    </div>
  )
}

export default PendingTxCard
