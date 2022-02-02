import React from "react"
import { useOsStore } from "stores/useOsStore"
import { useAccount } from "wagmi"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import useForm from "hooks/useForm"
import { ethers } from "ethers"
import { createSafeSdk } from "utils/createSafeSdk"
import { useMutation } from "react-query"
import * as api from "../../query"

const OfferModal = () => {
  const osOfferModalOpen = useOsStore(state => state.osOfferModalOpen)
  const setOsOfferModalOpen = useOsStore(state => state.setOsOfferModalOpen)
  const osAssetInfo = useOsStore(state => state.osAssetInfo)
  const setOsAssetInfo = useOsStore(state => state.setOsAssetInfo)
  const [txWaiting, setTxWaiting] = React.useState(false)

  const [{ data, error, loading }, disconnect] = useAccount()

  const {
    data: storedTxData,
    status: storedTxStatus,
    mutateAsync: storeTx,
  } = useMutation(api.storeTxOffChain)

  const [safes, setSafes] = React.useState()
  const { state, setState, handleChange } = useForm()

  const getUserSafes = async () => {
    if (!data?.address) return
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    const safes = await safeService.getSafesByOwner(data?.address)
    setSafes(safes.safes)
  }

  React.useEffect(() => {
    getUserSafes()
  }, [])

  const closeModal = e => {
    if (!osOfferModalOpen && e.target) {
      return
    }
    setOsOfferModalOpen()
    // setOsAssetInfo({})
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!state.safe) {
      // timeout error on ui "please pick a safe"
      console.log("no safe submitted")
      return
    }
    // createSafeSdk
    const safeSdk = await createSafeSdk(state.safe)
    // construct txs
    let wei = ethers.utils.parseEther(state.offerValue)
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
    // modal in waiting state
    setTxWaiting(true)
    try {
      // Sign the transaction off-chain (in wallet)
      const signedTransaction = await safeSdk.signTransaction(safeTransaction)
    } catch (error) {
      setTxWaiting(false)
      // user rejected tx
      return
    }
    // safeService to propose tx
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    let safeAddress = state.safe
    const transactionConfig = {
      safeAddress,
      safeTransaction,
      safeTxHash,
      senderAddress: data.address,
    }
    const proposedTx = await safeService.proposeTransaction(transactionConfig)
    // if proposedTx fails - txLoading(false)...
    const tx = {
      approvals: [data?.address],
      creator: data?.address,
      txHash: safeTxHash,
      tokenContract: osAssetInfo?.address,
      tokenId: osAssetInfo?.token_id,
      safeContract: state.safe,
      value: weiString,
      type: 1,
    }
    storeTx(tx)
    // if storeTx fails...
    // tx success, waiting state false
    setTxWaiting(false)
    // show confirmation in modal
    // render button to close OfferModal
  }

  if (!osOfferModalOpen) return <></>

  // if txWaiting ?
  if (txWaiting) {
    return (
      <div
        className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
        onClick={e => closeModal(e)}
      >
        <div
          className="z-50 mx-auto mt-24 flex h-1/3 w-full flex-col items-center rounded-xl bg-slate-200 py-6 px-4 shadow dark:bg-slate-900 md:w-6/12"
          onClick={e => closeModal(e)}
        >
          <div className="mt-10 motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
            <img alt="" src="/babydao.png" width={200} height={200} />
          </div>
          <h1 className="animation animate-pulse text-xl">
            please check your wallet...
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <div
        className="min-h-3/4 z-50 mx-auto mt-24 flex w-full flex-col items-center rounded-xl bg-slate-200 py-6 px-4 shadow dark:bg-slate-900 md:w-6/12"
        onClick={e => closeModal(e)}
      >
        <img
          className="mb-2"
          width="250px"
          src={osAssetInfo.image_url}
          alt={osAssetInfo?.token_id}
        />

        {/* form to get proposed offer value */}
        {/* onSubmit make offer */}
        <form className="w-11/12" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="text-sm font-bold" htmlFor="name">
              Offer (in ETH)
            </label>
            <input
              value={state.offerValue || ""}
              onChange={handleChange}
              className="focus:shadow-outline mb-4 w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
              id="offerValue"
              name="offerValue"
              type="number"
              placeholder="ETH value"
              required
            />

            <span className="font-semibold">
              Please pick a dao to perform this action from
            </span>
            {/* iterate through safes into radio input buttons, value will be picked up by useForm */}
            <div className="my-2 mb-4 grid grid-cols-3">
              {safes?.length
                ? safes?.map((safe, index) => (
                    <div
                      className="m-1 bg-slate-300 p-3 dark:bg-slate-800"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="safe"
                        checked={state.safe === safe}
                        onChange={handleChange}
                        value={safe}
                      />
                      <label className="bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text pl-4 font-semibold text-transparent">
                        {safe.substring(0, 6) +
                          "..." +
                          safe.substring(safe.length - 5, safe.length - 1)}
                      </label>
                    </div>
                  ))
                : "no safes"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded-xl bg-slate-300 py-3 px-4 font-bold shadow-xl hover:bg-slate-400 focus:outline-none dark:bg-slate-800 dark:hover:bg-slate-700"
              type="submit"
            >
              submit
            </button>
          </div>
        </form>
        {/* form */}
      </div>
    </div>
  )
}

export default OfferModal
