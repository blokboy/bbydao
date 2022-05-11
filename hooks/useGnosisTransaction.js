import { ethers } from "ethers"
import React, { useCallback, useState } from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import GnosisSafeSol from "@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json"
const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const CALL = 0

import { useSigner } from "wagmi"
import { amount } from "../components/Dao/UniswapLpModal/helpers"
import useSafeSdk from "./useSafeSdk"

export default function useGnosisTransaction(safeAddress) {
  const safeSdk = useSafeSdk(safeAddress)
  const [{ data: signer }] = useSigner()
  const bbyDaoSafe = React.useMemo(() => {
    return safeAddress && signer ? new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer) : null
  }, [signer, safeAddress])

  const signerAddress = React.useMemo(() => {
    return signer ? signer._address : null
  }, [signer])

  const contractInterface = useCallback(contract => {
    const fragments = contract.instance.interface.functions
    let abi = new ethers.utils.Interface(contract.abi)
    const data = abi.encodeFunctionData(fragments[contract.fn], Object.values(contract.args))

    return { data }
  }, [])

  const gnosisTransaction = React.useCallback(
    async (contract, to, value) => {
      try {
        if (!safeSdk || !signerAddress || !bbyDaoSafe) {
          throw new Error("no signer address or no bbyDao Safe instance or safe SDK")
        }

        const nonce = await safeService.getNextNonce(safeAddress)

        /* Encode Data */
        const { data } = contractInterface(contract)

        /*  construct gnosis transaction object  */
        const safeTx = {
          to: ethers.utils.getAddress(to),
          value: amount(parseFloat(ethers.utils.formatEther(value))),
          data,
          operation: CALL,
          safeTxGas: 0,
          baseGas: 0,
          gasPrice: 0,
          gasToken: ZERO_ADDRESS,
          refundReceiver: ZERO_ADDRESS,
          nonce,
        }

        const threshold = await bbyDaoSafe?.getThreshold()
        if (threshold.toNumber() > 1) {
          /*  Reject or ask for approvals */
          throw new Error("Multiple approvals needed")
        }

        const safeTransaction = await safeSdk.createTransaction(safeTx)
        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
        await safeService.proposeTransaction({
          safeAddress: ethers.utils.getAddress(safeAddress),
          safeTransaction,
          safeTxHash,
          senderAddress: signerAddress,
        })
        const transaction = await safeService.getTransaction(safeTxHash)
        const hash = transaction?.safeTxHash
        const sig = await safeSdk.signTransactionHash(hash)
        await safeService.confirmTransaction(hash, sig?.data)
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
        return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
      } catch (err) {
        console.log("err", err) //TODO: make notif or BNC
      }
    },
    [bbyDaoSafe, signerAddress, safeSdk]
  )

  return {
    gnosisTransaction,
  }
}
