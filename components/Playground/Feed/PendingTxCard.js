import SafeServiceClient from "@gnosis.pm/safe-service-client"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime.ts"
import { HiCheckCircle } from "react-icons/hi"
import useSafeSdk from "../../../hooks/useSafeSdk"
import { useLayoutStore } from "../../../stores/useLayoutStore"
import { usePlaygroundStore } from "../../../stores/usePlaygroundStore"

const PendingTxCard = ({ tx }) => {
  console.log("tx", tx)
  const { timeFromNow } = useRelativeTime()
  const { transaction } = tx
  const { to } = transaction?.txInfo
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const signer = useLayoutStore(state => state.signer)

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.timestamp || tx?.transaction?.timestamp)
  }, [tx.timestamp, tx?.transaction?.timestamp, timeFromNow])

  const status = React.useMemo(() => {
    //SUCCESS
    //AWAITING_EXECUTION
    //AWAITING_CONFIRMATIONS
    return transaction?.txStatus === "SUCCESS" ? <HiCheckCircle size={28} /> : null
  }, [transaction])

  const isMissingSigner = React.useMemo(() => {
    return transaction?.executionInfo?.missingSigners?.filter(s => s.value === signer?._address).length > 0
  }, [signer, transaction])

  const safeTxHash = React.useMemo(() => {
    return transaction?.id?.replace(`multisig_${bbyDao}_`, "")
  }, [bbyDao, transaction])

  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")
  const pendingTx = React.useMemo(async () => {
    try {
      if (!!safeTxHash) {
        const transaction = await safeService.getTransaction(safeTxHash)
        return transaction
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [safeTxHash])

  const canExecute = React.useMemo(() => {
    return transaction?.executionInfo?.confirmationsSubmitted === transaction?.executionInfo?.confirmationsRequired
  }, [])

  const safeSdk = useSafeSdk(bbyDao)

  const handleExecution = async () => {
    try {
      const transaction = await pendingTx
      const executeTxResponse = await safeSdk.executeTransaction(transaction)
      return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
    } catch (err) {
      console.log("error", err)
    }
  }

  const handleRejection = async () => {
    try {
      const transaction = await pendingTx
      const rejectTxResponse = await safeSdk.createRejectionTransaction(transaction.nonce)
      console.log('r', rejectTxResponse)
      // return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
    } catch (err) {
      console.log("error", err)
    }
  }

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
        <div className="mb-2 text-xs font-thin">Status: {transaction?.txStatus}</div>
        <div className="flex gap-1 text-sm font-thin">
          <div>{transaction?.executionInfo?.confirmationsSubmitted}</div>
          <div>out of</div>
          <div>{transaction?.executionInfo?.confirmationsRequired}</div>
          <div>required signatures.</div>
        </div>
        <div></div>
      </div>

      {/*<div className="text-xs font-thin">Safe Tx: {safeTxHash}</div>*/}

      <div className="mt-2 flex gap-2">
        {isMissingSigner ? (
          <button className="mt-4 inline-flex items-center self-start rounded px-4 py-2 font-thin dark:bg-orange-600 dark:hover:bg-orange-700">
            Sign
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 self-start rounded bg-slate-300 px-4 py-2 font-thin dark:bg-slate-900">
            Signed
            <HiCheckCircle />
          </div>
        )}
        {!transaction?.txInfo?.isCancellation && (
          <button
            type="button"
            className="inline-flex items-center self-start rounded bg-red-600 px-4 py-2 font-thin text-white hover:bg-red-700 dark:bg-rose-700 dark:hover:bg-rose-600"
            onClick={canExecute ? () => handleRejection() : () => {}}
          >
            Reject
          </button>
        )}
        <button
          className={`inline-flex items-center self-start rounded bg-green-600 px-4 py-2 font-thin text-white dark:bg-green-700 ${
            canExecute ? "hover:bg-green-700 dark:hover:bg-green-600" : "opacity-50"
          }`}
          type="button"
          disabled={!canExecute}
          onClick={canExecute ? () => handleExecution() : () => {}}
        >
          Execute
        </button>
      </div>
    </div>
  )
}

export default PendingTxCard
