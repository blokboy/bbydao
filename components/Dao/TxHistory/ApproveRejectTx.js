import React from "react"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSafeSdk } from "../../../utils/createSafeSdk"

const ApproveRejectTx = ({ tx, address }) => {
  const { id, type, value, txHash, safeContract, approvals, rejections } = tx

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleApprove = async e => {
    e.preventDefault()
    try {      
      if(type === 6) {
        const tx = {
          id: id,
          txHash: txHash,
          value: value,
          type: type,
          approvals: approvals?.length ? [ ...approvals, address] : [address],
        }
    
        mutateTx(tx)
      }
      const safeSdk = await createSafeSdk(safeContract)
      await safeSdk.signTransactionHash(txHash);
  
      // send tx to backend
      
    } catch(e) {
      console.log('signing error ', e);
    } 
  }

  const handleReject = async e => {
    e.preventDefault()
    try {
      // send tx to backend
      const tx = {
        id: id,
        txHash: txHash,
        value: value,
        type: type,
        rejections: rejections?.length ? [ ...rejections, address] : [address],
      }

      mutateTx(tx)
    } catch(e) {
      console.log('signing error ', e)
    }
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
