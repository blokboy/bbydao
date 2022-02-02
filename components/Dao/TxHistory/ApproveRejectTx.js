import React from "react"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSafeSdk } from "../../../utils/createSafeSdk"

const ApproveRejectTx = ({ tx, address }) => {
  const { id, type, value, txHash, safeContract } = tx

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleApprove = async e => {
    e.preventDefault()
    // create safeService
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    const nextNonce = await safeService.getNextNonce(safeContract)
    // createSafeSdk
    const safeSdk = await createSafeSdk(safeContract)
    // construct tx
    let fee = (Number(value) * 0.01).toString()
    const transactions = [
      {
        to: process.env.dao,
        data: ethers.utils.hexlify([Math.floor(Math.random()), 1]),
        value: fee,
        nonce: nextNonce,
      },
    ]
    // create safeTransaction
    const safeTransaction = await safeSdk.createTransaction(...transactions)
    try {
      // Sign the transaction off-chain (in wallet)
      const signedTransaction = await safeSdk.signTransaction(safeTransaction)
      // send tx to backend
      const tx = {
        id: id,
        txHash: txHash,
        value: value,
        type: type,
        approvals: [address],
      }
      mutateTx(tx)
    } catch (error) {
      // if error
      console.log("signing error", error)
      return
    }
  }

  const handleReject = async e => {
    e.preventDefault()
    console.log("reject type", type)
    console.log("reject hash", txHash)
  }

  return (
    <>
      <button
        className="mr-1 rounded-lg bg-red-400 p-1 text-xs shadow-sm hover:bg-red-600"
        onClick={handleReject}
      >
        reject
      </button>
      <button
        className="rounded-lg bg-green-500 p-1 text-xs shadow-sm hover:bg-green-600"
        onClick={handleApprove}
      >
        approve
      </button>
    </>
  )
}

export default ApproveRejectTx
