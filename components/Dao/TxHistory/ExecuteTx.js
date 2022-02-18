import React from "react"
import { ethers } from "ethers"
import * as api from "../../../query"
import { useMutation } from "react-query"
import { createSeaport } from "utils/createSeaport"
import { createSafeSdk } from "utils/createSafeSdk"

const ExecuteTx = ({ tx, address }) => {
  const { id, type, value, tokenContract, tokenId, txHash, safeContract } = tx

  const {
    data: mutateTxData,
    status: mutateTxStatus,
    mutateAsync: mutateTx,
  } = useMutation(api.mutateOffChainTx)

  const handleExecute = async e => {
    e.preventDefault()
    if (type === 1) {
      let acct = await window.ethereum.request({ method: 'eth_requestAccounts' })
      acct = ethers.utils.getAddress(...acct);
      console.log('addr ', acct)
      // opensea offer tx
      const seaport = await createSeaport()
      let ethValue = ethers.utils.formatEther(value)
      ethValue = Number(ethValue);
      const desiredAsset = await seaport.api.getAsset({
        tokenId,
        tokenAddress: tokenContract
      })

      const order = {
        asset: {
          tokenId: desiredAsset.tokenId,
          tokenAddress: desiredAsset.tokenAddress,
          schemaName: desiredAsset.schemaName === "ERC1155" ? "ERC1155" : "ERC721"
        },
        accountAddress: safeContract, // contract address can't be input here
        startAmount: ethValue,
      }
      
      const offer = await seaport.createBuyOrder(order)
      console.log("offer", offer)
    }

    if (type === 2) { 
      // opensea purchase tx
      let acct = await window.ethereum.request({ method: 'eth_requestAccounts' })
      acct = ethers.utils.getAddress(...acct);
      console.log('addr ', acct)
      // opensea offer tx
      const seaport = await createSeaport()
      let ethValue = ethers.utils.formatEther(value)
      ethValue = Number(ethValue);
      const desiredAsset = await seaport.api.getAsset({
        tokenId,
        tokenAddress: tokenContract
      });
      
      const order = {
        asset: {
          tokenId: desiredAsset.tokenId,
          tokenAddress: desiredAsset.tokenAddress,
          schemaName: desiredAsset.schemaName === "ERC1155" ? "ERC1155" : "ERC721"
        },
        accountAddress: safeContract, // contract address can't be input here
        startAmount: ethValue,
      }

      const offer = await seaport.createBuyOrder(order)
      console.log('offer ', offer);

      const transfer = await seaport.fulfillOrder({
        order: offer,
        accountAddress: acct,
        recipientAddress: safeContract
      })

      console.log('transfer ', transfer);
    }

    

    /*
    // create fee tx for our safe
    const safeSdk = await createSafeSdk(safeContract)
    let wei = ethers.utils.parseEther(value)
    let weiString = wei.toString()
    let fee = (Number(weiString) * 0.01).toString()
    const transactions = [
      {
        to: process.env.dao,
        data: ethers.utils.hexlify([1]),
        value: fee,
      },
    ]
    const safeTransaction = await safeSdk.createTransaction(...transactions)
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    try {
      // Sign the transaction off-chain (in wallet)
      const signedTransaction = await safeSdk.signTransaction(safeTransaction)
      // mutate tx on backend
      const tx = {
        txHash: txHash,
        executor: address,
      }
      mutateTx(tx)
    } catch (error) {
      // user rejected tx
      console.log("user rejected tx")
      return
    }
    */
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
