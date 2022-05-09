import React from "react"
import Link from "next/link"
import { useRelativeTime } from "../../../../hooks/useRelativeTime.ts"

// currently renders only one uniform tx card
// break up into multi_sig, eth_tx, etc.
// style uniquely to differentiate them from each other
// will give users a good sense of how active a dao is and the types of txs that are occurring
// i think TxCards should be expandable in some way
// multi_sig txs in particular, an expanded view would be useful to display more info / actions on that tx
const TxCard = ({ tx }) => {
  const { timeFromNow } = useRelativeTime()
  console.log("TxCard tx:", tx)

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.executionDate ?? tx?.submissionDate)
  }, [tx.executionDate, tx.submissionDate, timeFromNow])

  const txType = React.useMemo(() => {
    return tx ? tx.txType.toLowerCase().replace("_", " ").replace("ethereum", "personal") : null
  }, [tx])

  const txToFrom = React.useMemo(() => {
    return tx ? (
      <div className="flex w-full justify-between">
        <div className="mr-6 flex">
          <span className="mr-2">{!!tx.from ? "From" : "Safe"}: </span>
          <a
            href={`https://etherscan.io/address/${!!tx.from ? tx.from : tx.safe}`}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sky-400 hover:underline"
          >
            {!!tx.from ? tx.from.replace("0x", "").slice(0, 6) : tx.safe.replace("0x", "").slice(0, 6)}
          </a>
        </div>
        <div className="flex">
          <span className="mr-2"> To: </span>
          <a
            href={`https://etherscan.io/address/${tx.to}`}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sky-400 hover:underline"
          >
            {tx.to.replace("0x", "").slice(0, 6)}
          </a>
        </div>
      </div>
    ) : null
  }, [tx])

  return (
    <div className="mt-3 text-xs first:mt-0">
      <div className="p-2 text-xs first:pt-0">{txType}</div>
      <div className="flex flex-col space-x-2 rounded-xl bg-slate-200 p-3 dark:bg-slate-800 md:flex-row">
        <div className="mr-3 h-16 w-16 rounded-full border border-white"></div>
        <div className="flex-1">
          <div className="mt-3 flex w-full items-center justify-between md:mt-0">
            {txToFrom}
            <div className="w-full text-right">{txTimeFromNow}</div>
          </div>
          {tx?.txHash ? (
            <Link href={`https://etherscan.io/tx/${tx?.txHash}`} passHref>
              <a target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400">
                view on etherscan
              </a>
            </Link>
          ) : null}
          <button type="button" className="mt-3 w-full rounded-xl bg-slate-300 py-1 dark:bg-slate-700">
            more info
          </button>
        </div>
      </div>
    </div>
  )
}

export default TxCard
