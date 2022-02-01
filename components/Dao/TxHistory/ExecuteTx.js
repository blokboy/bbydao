import React from "react"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "../../../query"
import { useMutation } from "react-query"

const ExecuteTx = ({ tx }) => {
  const { type, txHash } = tx

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleExecute = async e => {
    e.preventDefault()
    console.log("execute type", type)
    console.log("execute hash", txHash)
  }

  return (
    <button
      className="mr-1 rounded-lg bg-blue-400 p-1 text-xs shadow-sm hover:bg-blue-500"
      onClick={handleExecute}
    >
      execute
    </button>
  )
}

export default ExecuteTx
