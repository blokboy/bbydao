import React from "react"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSeaport } from "utils/createSeaport"
import { createSafeSdk } from "utils/createSafeSdk"

const ExecuteTx = ({ tx }) => {
  const { id, type, value, txHash, safeContract } = tx

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleExecute = async e => {
    e.preventDefault()

    // opensea tx, v3 tx, or tx
    // const seaport = createSeaport()

    // create fee tx for our safe
    // const safeSdk = await createSafeSdk(safeContract)

    // mutate tx on backend
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
