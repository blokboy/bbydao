import React from "react"
import useForm from "hooks/useForm"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

const TransactionForm = ({ safeAddress }) => {
  const { state, setState, handleChange } = useForm()

  /*
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

  - PROPOSE TRANSACTION -
  const transactionConfig = {
    safeAddress,
    safeTransaction,
    safeTxHash,
    senderAddress
  }
  await safeService.proposeTransaction(transactionConfig)

  - CONFIRM TRANSACTION - 
  const signature = await safeService.confirmTransaction(safeTxHash, signature)
  */

  const submitTransaction = async safeAddress => {
    if (!safeAddress) {
      console.log("no safe address")
      return
    }
    console.log("safeAddress", safeAddress)

    await window.ethereum.enable()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const owner1 = provider.getSigner(provider.provider.selectedAddress)
    console.log("owner1", owner1)

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: owner1,
    })
    console.log("ethAdapter", ethAdapter)

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: safeAddress,
      isL1SafeMasterCopy: true,
    })

    console.log("safeSdk", safeSdk)

    let wei = ethers.utils.parseEther(state.value)
    let weiString = wei.toString()
    console.log("weiString", weiString)

    const transaction = {
      to: state.to,
      value: weiString,
      data: state.data,
    }
    console.log("transaction", transaction)

    const safeTransaction = await safeSdk.createTransaction(transaction)
    console.log("safeTransaction", safeTransaction)
    const txHash = await safeSdk.getTransactionHash(safeTransaction)
    console.log("txHash", txHash)

    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )

    const transactionConfig = {
      safeAddress: safeAddress,
      safeTransaction: safeTransaction,
      safeTxHash: txHash,
      senderAddress: provider.provider.selectedAddress,
    }
    await safeService.proposeTransaction(transactionConfig)
    // console.log("proposed", proposed)

    // const owner1Signature = await safeSdk.signTransaction(safeTransaction)
    // console.log("owner1Signature", owner1Signature)
    // return txHash
  }

  const handleSubmit = e => {
    e.preventDefault()
    submitTransaction(safeAddress)
    setState({})
  }

  return (
    <form
      className="flex flex-col mt-24 mx-auto z-50 rounded shadow-xl w-full md:w-3/6 md:rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900"
      onSubmit={handleSubmit}
    >
      <div className="w-full text-xl text-center font-bold mb-8">
        transaction
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          to
        </label>
        <input
          value={state.to || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
          id="name"
          name="to"
          type="text"
          placeholder="address"
          required
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          value
        </label>
        <input
          value={state.value || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
          id="name"
          name="value"
          type="number"
          placeholder="value"
          required
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          data
        </label>
        <input
          value={state.data || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
          id="name"
          name="data"
          type="text"
          placeholder="data"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline shadow-xl bg-gray-200 dark:bg-gray-800"
          type="submit"
        >
          send
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
