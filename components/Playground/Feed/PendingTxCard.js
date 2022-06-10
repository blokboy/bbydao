import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useRelativeTime } from "hooks/useRelativeTime.ts"
import React from "react"
import { HiCheckCircle, HiOutlinePencilAlt } from "react-icons/hi"
import useSafeSdk from "hooks/useSafeSdk"
import { useQuery, useQueryClient } from "react-query"
import { useLayoutStore } from "stores/useLayoutStore"
import { usePlaygroundStore } from "stores/usePlaygroundStore"

const PendingTxCard = ({ tx }) => {
  const queryClient = useQueryClient()
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")
  const { timeFromNow } = useRelativeTime()
  const { transaction } = tx
  const { to } = transaction?.txInfo
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const signer = useLayoutStore(state => state.signer)
  const safeSdk = useSafeSdk(bbyDao)

  const txTimeFromNow = React.useMemo(() => {
    return timeFromNow(tx?.timestamp || tx?.transaction?.timestamp)
  }, [tx.timestamp, tx?.transaction?.timestamp, timeFromNow])

  const status = React.useMemo(() => {
    switch (transaction?.txStatus) {
      case "SUCCESS":
        return <HiCheckCircle size={28} />
      case "AWAITING_EXECUTION":
        return "Ready to Execute!"
      case "AWAITING_CONFIRMATIONS":
        return "Additional Signatures Needed."
      default:
        return ""
    }
  }, [transaction])

  const isMissingSigner = React.useMemo(() => {
    return transaction?.executionInfo?.missingSigners?.filter(s => s.value === signer?._address).length > 0
  }, [signer, transaction])

  const safeTxHash = React.useMemo(() => {
    return transaction?.id?.replace(`multisig_${bbyDao}_`, "")
  }, [bbyDao, transaction])

  const pendingTx = React.useMemo(async () => {
    try {
      if (!!safeTxHash) {
        return await safeService.getTransaction(safeTxHash)
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [safeTxHash])

  const canExecute = React.useMemo(() => {
    return transaction?.executionInfo?.confirmationsSubmitted === transaction?.executionInfo?.confirmationsRequired
  }, [])

  const hasPendingRejection = React.useMemo(() => {
    if (tx.conflictType === "HasNext") {
      const results = queryClient.getQueryData(["txsQueued", bbyDao])?.results
      const filter = results.filter(
        item => item?.transaction?.executionInfo?.nonce === transaction?.executionInfo?.nonce
      )
      const end = filter.filter(item => item.conflictType === "End")?.[0]
      if (end.transaction?.txInfo.isCancellation === true) {
        return true
      }
    }
  }, [transaction])

  const handleExecution = async () => {
    try {
      const transaction = await pendingTx
      const safeTransactionData = {
        to: transaction.to,
        value: transaction.value,
        data: transaction.data ?? "0x",
        operation: transaction.operation,
        safeTxGas: transaction.safeTxGas,
        baseGas: transaction.baseGas,
        gasPrice: transaction.gasPrice,
        gasToken: transaction.gasToken,
        refundReceiver: transaction.refundReceiver,
        nonce: transaction.nonce,
      }
      const safeTransaction = await safeSdk.createTransaction(safeTransactionData)
      const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
      return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
      //TODO: notify
    } catch (err) {
      console.log("error", err)
    }
  }

  const handleRejection = async () => {
    try {
      const transaction = await pendingTx
      const rejectTxResponse = await safeSdk.createRejectionTransaction(transaction?.nonce)
      const safeTxHash = await safeSdk.getTransactionHash(rejectTxResponse)
      await safeService.proposeTransaction({
        safeAddress: bbyDao,
        safeTransaction: rejectTxResponse,
        safeTxHash,
        senderAddress: signer._address,
      })
      const sig = await safeSdk.signTransactionHash(safeTxHash)
      await safeService.confirmTransaction(safeTxHash, sig?.data)
      if (canExecute) {
        const executeTxResponse = await safeSdk.executeTransaction(rejectTxResponse)
        return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
      }

      //TODO: notify
    } catch (err) {
      console.log("error", err)
    }
  }

  const handleSign = async () => {
    try {
      const sig = await safeSdk.signTransactionHash(safeTxHash)
      await safeService.confirmTransaction(safeTxHash, sig?.data)
      //TODO: notify
    } catch (error) {
      console.log("err", error)
    }
  }

  const isMember = React.useMemo(() => {
    return queryClient.getQueryData(["isMember", signer?._address])
  }, [queryClient, signer])

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
          Status: {status} {hasPendingRejection ? <span className="text-red-600">- pending cancellation</span> : null}
        </div>
        <div className="flex gap-1 text-sm font-thin">
          <div>{transaction?.executionInfo?.confirmationsSubmitted}</div>
          <div>out of</div>
          <div>{transaction?.executionInfo?.confirmationsRequired}</div>
          <div>required signatures.</div>
        </div>
      </div>
      {isMember ? (
        <div className="mt-2 flex gap-2">
          {isMissingSigner ? (
            <button
              onClick={() => handleSign()}
              className="inline-flex items-center self-start rounded px-4 py-2 font-thin dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              <span className="mr-2">Sign</span>
              <HiOutlinePencilAlt />
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 self-start rounded bg-slate-300 px-4 py-2 font-thin dark:bg-slate-900">
              Signed
              <HiCheckCircle />
            </div>
          )}
          {!transaction?.txInfo?.isCancellation && !hasPendingRejection && (
            <button
              type="button"
              className="inline-flex items-center self-start rounded bg-red-600 px-4 py-2 font-thin text-white hover:bg-red-700 dark:bg-rose-700 dark:hover:bg-rose-600"
              onClick={() => handleRejection()}
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
      ) : null}
    </div>
  )
}

export default PendingTxCard
