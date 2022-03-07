import React from "react"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSafeSdk } from "../../../utils/createSafeSdk"
import { useAccount } from "wagmi"

const ApproveRejectTx = ({ tx, address }) => {
  const [{ data, error, loading: accountLoading }, disconnect] = useAccount()
  const { id, type, value, txHash, safeContract, approvals, rejections } = tx
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )
  const [loading, setLoading] = React.useState(false)

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleApprove = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (type === 6) {
        // Opensea sales
        const tx = {
          id: id,
          txHash: txHash,
          value: value,
          type: type,
          approvals: approvals?.length ? [...approvals, address] : [address],
        }

        mutateTx(tx)
      }

      if (type === 4) {
        // transfer transaction
        const sigs = []
        const signers = await safeService.getTransactionConfirmations(txHash)

        for (let i = 0; i < signers.results.length; i++) {
          sigs.push(signers.results[i].owner)
        }

        if (sigs.includes(data?.address)) {
          return
        } else {
          const safeSdk = await createSafeSdk(safeContract)
          const safeTx = await safeService.getTransaction(txHash)

          await safeSdk.signTransaction(safeTx)
          await safeSdk.signTransactionHash(txHash)

          const tx = {
            id: id,
            txHash: txHash,
            approvals: approvals?.length ? [...approvals, address] : [address],
          }

          mutateTx(tx)
        }
      }
    } catch (e) {
      console.log("signing error ", e)
    }
    setLoading(false)
  }

  const handleReject = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      // send tx to backend
      const tx = {
        id: id,
        txHash: txHash,
        value: value,
        type: type,
        rejections: rejections?.length ? [...rejections, address] : [address],
      }

      mutateTx(tx)
    } catch (e) {
      console.log("signing error ", e)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="mr-1 animate-pulse rounded-lg p-1 text-xs shadow-sm">
        check your wallet
      </div>
    )
  }

  return (
    <>
      <button
        className="mr-1 rounded-lg bg-green-500 p-1 text-xs shadow-sm hover:bg-green-600"
        onClick={handleApprove}
      >
        approve
      </button>
      <button
        className="rounded-lg bg-red-400 p-1 text-xs shadow-sm hover:bg-red-600"
        onClick={handleReject}
      >
        reject
      </button>
    </>
  )
}

export default ApproveRejectTx
