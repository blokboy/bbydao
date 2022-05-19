import { ethers } from "ethers"
import React, { useCallback, useState } from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import GnosisSafeSol from "@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json"
const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const CALL = 0

import { useSigner }  from "wagmi"
import { amount }     from "../components/Dao/Uniswap/helpers"
import useSafeSdk     from "./useSafeSdk"

export default function useGnosisTransaction(safeAddress) {
  const safeSdk = useSafeSdk(safeAddress)
  const { data: signer } = useSigner()
  const bbyDaoSafe = React.useMemo(() => {
    return safeAddress && signer ? new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer) : null
  }, [signer, safeAddress])

  const signerAddress = React.useMemo(() => {
    return signer ? signer._address : null
  }, [signer])

  const contractInterface = useCallback(contract => {
    const fragments = contract.instance.interface.functions
    let abi = new ethers.utils.Interface(contract.abi)
    let data
    if (!!contract.args) {
      data = abi.encodeFunctionData(fragments[contract.fn], Object.values(contract.args))
    } else {
      data = abi.encodeFunctionData(fragments[contract.fn])
    }
    return { data }
  }, [])

  const gnosisTransaction = React.useCallback(
    async (contract, to, value, fee) => {
      try {
        if (!safeSdk || !signerAddress || !bbyDaoSafe) {
          throw new Error("no signer address or no bbyDao Safe instance or safe SDK")
        }

        /* Encode Data */
        const { data } = contractInterface(contract)

        /* last transaction made by bbyDAO */
        const nonce = await safeService.getNextNonce(safeAddress)

        /*  construct gnosis transaction object  */
        const safeTx = [{
          to: ethers.utils.getAddress(to),
          value: amount(parseFloat(ethers.utils.formatEther(value))), //
          data,
          operation: CALL,
          safeTxGas: 0,
          baseGas: 0,
          gasPrice: 0,
          gasToken: ZERO_ADDRESS,
          refundReceiver: ZERO_ADDRESS,
          nonce,
        }]

        /* charge 1% fee  */
        if(!!fee) {
          let receiverAddress = process.env.dao
          let tx = {
            to: receiverAddress,
            data: '0x',
            value: fee
          }

          safeTx.push(tx)
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
        // indicate when execute has started and close panel
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
        console.log(
          "ex",
          executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        )

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
