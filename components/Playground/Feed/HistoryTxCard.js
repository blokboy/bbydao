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

  const [isExpanded, setExpanded] = React.useState(false)

  const expandInfo = React.useCallback(() => {
    if (!isExpanded) {
      setExpanded(true)
    }
  }, [isExpanded])

  const collapseInfo = React.useCallback(() => {
    if (isExpanded) {
      setExpanded(false)
    }
  }, [isExpanded])

  const moreInfoButton = React.useMemo(() => {
    return (
        <button
            type="button"
            onClick={isExpanded ? collapseInfo : expandInfo}
            className="mt-3 w-full rounded-xl bg-slate-300 py-1 dark:bg-slate-700"
        >
          {isExpanded ? "hide" : "more"} info
        </button>
    )
  }, [isExpanded])

  const expandedInfo = React.useMemo(() => {
    return isExpanded ? (
        <div className="flex flex-col px-1 py-3 lg:flex-row">
          <div className={`w-full ${tx.txType === "MULTISIG_TRANSACTION" ? "lg:mr-2 lg:w-1/2" : ""}`}>
            <ul className={`${tx.txType !== "MULTISIG_TRANSACTION" ? "flex justify-between flex-wrap" : ""}`}>
              <li className={`${tx.txType !== "MULTISIG_TRANSACTION" ? "mt-2" : ""}`}>
                <div>data:</div>
                {tx.dataDecoded ? (
                    <textarea
                        className="h-16 w-full rounded-md border border-gray-300 p-2"
                        disabled
                        value={JSON.stringify(tx.dataDecoded)}
                    />
                ) : (
                    <div>n/a</div>
                )}
              </li>
              <li className="mt-2">
                <div>nonce:</div>
                {tx.nonce ? <div>{tx.nonce}</div> : <div>n/a</div>}
              </li>
              <li className="mt-2">
                <div>gas used:</div>
                <div>{tx.gasUed}</div>
              </li>
              <li className="mt-2">
                <div>Sub. Date</div>
                <div>{tx.submissionDate ? formattedDate(tx.submissionDate) : "n/a"}</div>
              </li>
              <li className="mt-2">
                <div>Exec. Date</div>
                <div>{tx.executionDate ? formattedDate(tx.executionDate) : "n/a"}</div>
              </li>
            </ul>
          </div>
          {tx.txType === "MULTISIG_TRANSACTION" ? (
              <div className="mt-2 w-full lg:mt-0 lg:w-1/2">
                <ul>
                  <li>
                    <div>approvals:</div>
                    <div>
                      <ul className="mt-2 flex">
                        {tx.confirmations.map(({ owner }) => (
                            <li className="mr-2 rounded-xl bg-slate-300 px-3 py-1 dark:bg-slate-700">
                              <a
                                  href={`https://etherscan.io/address/${owner}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-400 hover:underline"
                              >
                                {owner.replace("0x", "").slice(0, 6)}
                              </a>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li className="mt-2">
                    <div>Executed by:</div>
                    {tx.executor ? (
                        <a
                            href={`https://etherscan.io/address/${tx.executor}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline"
                        >
                          {tx.executor.replace("0x", "").slice(0, 6)}
                        </a>
                    ) : (
                        <div>n/a</div>
                    )}
                  </li>
                </ul>
              </div>
          ) : null}
        </div>
    ) : null
  }, [tx, isExpanded])

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
    </div>
  )
}

export default HistoryTxCard
