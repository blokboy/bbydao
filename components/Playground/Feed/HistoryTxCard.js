import { useRelativeTime } from "hooks/useRelativeTime.ts"
import React from "react"
import { HiCheckCircle } from "react-icons/hi"
import { usePlaygroundStore } from "stores/usePlaygroundStore"

const HistoryTxCard = ({ tx }) => {
  const { timeFromNow } = useRelativeTime()
  const { transaction } = tx
  const { to } = transaction?.txInfo
  const bbyDao = usePlaygroundStore(state => state.expandedDao)

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.timestamp || tx?.transaction?.timestamp)
  }, [tx.timestamp, tx?.transaction?.timestamp, timeFromNow])

  const status = React.useMemo(() => {
    switch (transaction?.txStatus) {
      case "SUCCESS":
        return (
          <div className="flex items-center">
            <HiCheckCircle size={28} />
            Successful Transaction
          </div>
        )
      case "AWAITING_EXECUTION":
        return "Ready to Execute!"
      case "AWAITING_CONFIRMATIONS":
        return "Additional Signatures Needed."
      default:
        return ""
    }
  }, [transaction])

  const safeTxHash = React.useMemo(() => {
    return transaction?.id?.replace(`multisig_${bbyDao}_`, "")
  }, [bbyDao, transaction])

  return (
    <div className="mb-2 flex flex-col rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <div className="mb-2 flex justify-between text-xs font-thin">
        <div>{transaction?.executionInfo?.nonce}</div>
        <div>{txTimeFromNow}</div>
      </div>
      {!!to?.name && (
        <a
          href={`https://etherscan.io/address/${to?.value}#code`}
          className="flex flex-col rounded-xl bg-slate-300 p-4 dark:bg-slate-900"
          target="_blank"
        >
          {!!to?.name && (
            <div className="flex flex-col">
              <div className="text-xs font-thin">Interacting With:</div>
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 overflow-hidden rounded-full">
                  <img src={to?.logoUri} />
                </div>
                <div className="font-thin">{to?.name}</div>
              </div>
            </div>
          )}
          {(transaction?.txInfo?.methodName || transaction?.txInfo?.dataDecoded?.method) && (
            <div className="mt-4 font-thin">
              <div className="text-xs">action:</div>
              <div className="flex">{transaction?.txInfo?.methodName || transaction?.txInfo?.dataDecoded?.method}</div>
            </div>
          )}
        </a>
      )}
      <div className="mt-2 flex flex-col rounded-xl bg-slate-300 p-4 dark:bg-slate-900">
        {transaction?.txInfo?.isCancellation && (
          <div className="mb-2 text-sm font-thin">Cancel Transaction: {transaction?.executionInfo?.nonce}</div>
        )}
        <div className="mb-2 text-xs font-thin">
          Status: <div className="mt-2">{status}</div>
        </div>
        <div className="flex gap-1 text-sm font-thin">
          <div>{transaction?.executionInfo?.confirmationsSubmitted}</div>
          <div>out of</div>
          <div>{transaction?.executionInfo?.confirmationsRequired}</div>
          <div>required signatures.</div>
        </div>
      </div>
      {}
    </div>
  )
}

export default HistoryTxCard
