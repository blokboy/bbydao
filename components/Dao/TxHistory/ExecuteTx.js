import React from "react"
import { ethers } from "ethers"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSafeSdk } from "utils/createSafeSdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useAccount } from "wagmi"
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk"

const ExecuteTx = ({ tx, address }) => {
  const [{ data, error, loading: accountLoading }, disconnect] = useAccount()
  const { id, type, value, tokenContract, tokenId, txHash, safeContract, receiver, executor } = tx
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const {
    data: relationshipTxData,
    status: relationshipTxStatus,
    mutateAsync: createRelationshipTx,
  } = useMutation(api.reqRelationship)

  const {
    data: requestTxData,
    status: requestTxStatus,
    mutateAsync: mutateRelationshipTx,
  } = useMutation(api.updateRelationship)

  const {
    data: storeTxData,
    status: storeTxStatus,
    mutateAsync: storeTxOffChain,
  } = useMutation(api.storeTxOffChain)

  const { 
    data: deleteTxData,
    status: deleteTxStatus, 
    mutateAsync: deleteOffChainTx } = useMutation(api.deleteOffChainTx);

  const handleExecute = async e => {
    e.preventDefault()
    if (type === 1) {
      // zora purchase
    }

    if (type === 2) {
      // zora offer 
    }

    if(type === 3) {
      // zora sale 
    }

    if (type === 4) {
      // send tokens
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(provider.provider.selectedAddress)

        const safeSdk = await createSafeSdk(safeContract)
        const safeTx = await safeService.getTransaction(txHash)
        console.log('safe tx ', safeTx)
        const confirmations = await safeService.getTransactionConfirmations(safeTx.safeTxHash)
        console.log('conf ', confirmations.results)
        const safeTransaction = await safeSdk.createTransaction(safeTx)
        console.log('safe tx pre mod', safeTransaction)


        const safeTxData = {
          data: { 
            baseGas: 0,
            data: safeTx.data,
            gasPrice: safeTx.gasPrice,
            gasToken: safeTx.gasToken,
            nonce: safeTx.nonce,
            operation: safeTx.operation,
            refundReceiver: safeTx.refundReceiver,
            safeTxGas: safeTx.safeTxGas,
            to: safeTx.to,
            value: safeTx.value
           }
        }

        safeTx.confirmations.forEach(confirmation => {
          const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
          safeTransaction.addSignature(signature)
        })

        console.log('safe tx post mod', safeTransaction)
        const options = {
          gasLimit: 100000
        }
      
        const executed = await safeSdk.executeTransaction(safeTransaction, options)
        const receipt = executed.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        console.log('executed ', receipt)
        
        if(receipt) {
          const tx = {
            id: tx.id
          }
          await deleteOffChainTx(tx)
        }
      } catch(e) {
        console.log('exec error ', e)
      }
    }

    if(type === 6) { 
      // friend request
      if(value === "RESPONSE") {
        // if tx.value === RESPONSE then we just need to edit the current record with their accepted state or delete it if they rejected
        const req = {
          id: tx.executor, 
          status: 5 //pending request to friends
        }

        const txReq = {
          id: tx.id
        }

        await mutateRelationshipTx(req)
        await deleteOffChainTx(txReq)
      }

      if(value === "REQUEST") {
        // if tx.value === REQUEST then we need to make a relationship object between both DAOS and create a tx object for the receiving dao to respond
        const req = {
          initiator: safeContract,
          target: receiver,
          status: 3 //pending request
        }

        const reqTx = {
          id: tx.id
        }

        await deleteOffChainTx(reqTx)
        const transaction = await createRelationshipTx(req)

        const resTx = {
          creator: safeContract,
          receiver: safeContract, // the bbyDAO that initiated the request will be the receiver of the response
          safeContract: receiver, // the bbyDAO that needs to respond is the safeContract addr we need to attach tx to
          txHash: "DAOTODAO",
          type: 6,
          value: "RESPONSE",
          executor: transaction.id //the reference to the transaction for editing the relationship for acceptance or deletion
        }

        await storeTxOffChain(resTx)
      }
      
      return
    }
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
