import React                                    from "react"
import useForm                                  from "hooks/useForm"
import { ethers }                               from "ethers"
import { EthersAdapter }                        from "@gnosis.pm/safe-core-sdk"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient                        from "@gnosis.pm/safe-service-client"
import { useAccount }                           from "wagmi"
import { HiX }                                  from "react-icons/hi"
import { useUiStore }                           from "stores/useUiStore"
import { useMutation }                          from "react-query"
import * as api                                 from "../../query"
import { useDaoStore }                          from "../../stores/useDaoStore"

let safeSdk

const TransactionModal = ({ safeAddress }) => {
  const txModalOpen = useDaoStore(state => state.txModalOpen)
  const setTxModalOpen = useDaoStore(state => state.setTxModalOpen)
  const [txWaiting, setTxWaiting] = React.useState(false)
  const { state, setState, handleChange } = useForm()
  const [{ data, error, loading }, disconnect] = useAccount()

  const {
    data: storedTxData,
    status: storedTxStatus,
    mutateAsync: storeTx,
  } = useMutation(api.storeTxOffChain)

  React.useEffect(() => {
    setSafeAddress()
  }, [])

  const closeModal = e => {
    if (!txModalOpen && e.target) {
      return
    }
    // setState({})
    setTxModalOpen()
  }

  const setSafeAddress = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(provider.provider.selectedAddress)
    const ethAdapter = new EthersAdapter({ ethers, signer })
    safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeAddress,
    })
  }

  const sign = async e => {
    e.preventDefault()
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    await window.ethereum.request({ method: "eth_requestAccounts" })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(provider.provider.selectedAddress)
    // contract address to send to
    let wei = ethers.utils.parseEther(state?.value)
    let weiString = wei.toString()
    const transactions = [
      {
        to: "0x9195d47B8EEa7BF3957240126d26A97ff8f35c80",
        value: String(weiString * 0.02), //Math.floor?
        data: ethers.utils.hexlify([1])
      },
      {
        to: state?.to,
        value: String(weiString - (weiString * 0.02)),
        data: ethers.utils.hexlify([1]),
      },
    ]

    const options = {
      nonce: await safeService.getNextNonce(safeAddress)
    }
    const safeTransaction = await safeSdk.createTransaction(transactions, options)
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    // Sign the transaction off-chain (in wallet)
    setTxWaiting(true)
    try {
      const signedTransaction = await safeSdk.signTransaction(safeTransaction)
      console.log('signed tx ', signedTransaction)
    } catch (error) {
      setTxWaiting(false)
      console.log("error signing transaction", error)
      return
    }

    const transactionConfig = {
      safeAddress,
      safeTransaction,
      safeTxHash,
      senderAddress: data.address,
    }
    const proposedTx = await safeService.proposeTransaction(transactionConfig)
    console.log("proposedTx", proposedTx)

    const tx = {
      approvals: [data?.address],
      creator: data?.address,
      txHash: safeTxHash,
      receiver: state.to,
      // tokenContract: osAssetInfo?.address,
      // tokenId: osAssetInfo?.token_id,
      safeContract: safeAddress,
      value: String(weiString - weiString * 0.02),
      type: 4,
    }
    storeTx(tx)

    setTxWaiting(false)
    closeModal()
  }

  // const execute = async () => {
  //   await window.ethereum.enable()
  //   await window.ethereum.request({ method: "eth_requestAccounts" })

  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const signer = provider.getSigner(provider.provider.selectedAddress)

  //   const ethAdapter = new EthersAdapter({ ethers, signer })
  //   const safeSdk2 = await safeSdk.connect({
  //     ethAdapter,
  //     safeAddress: safeAddress,
  //   })
  //   // await safeSdk2.executeTransaction(safeTransaction)
  // }

  if (txWaiting) {
    return (
      <div
        className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
        onClick={e => closeModal(e)}
      >
        <div
          className="z-50 mx-auto mt-0 flex h-full w-full flex-col items-center justify-center bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-1/3 md:w-6/12 md:rounded-xl"
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
        className="z-50 mx-auto mt-0 flex h-full w-full flex-col items-center bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-auto md:w-6/12 md:rounded-xl"
        onClick={e => closeModal(e)}
      >
        <div className="flex w-full justify-end">
          <button className="modal-close-btn" onClick={e => closeModal(e)}>
            <HiX />
          </button>
        </div>

        <div className="mb-6 w-full text-center text-xl font-bold">
          transaction
        </div>

        <form className="flex w-full flex-col" onSubmit={sign}>
          <div className="mb-8 w-full">
            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              to
            </label>
            <input
              value={state?.to}
              onChange={handleChange}
              className="focus:shadow-outline h-16 w-full appearance-none rounded-lg border bg-slate-100 py-2 px-3 text-xl leading-tight shadow focus:outline-none dark:bg-slate-800"
              id="name"
              name="to"
              type="text"
              placeholder="address"
              required
            />
          </div>

          <div className="mb-8 w-full">
            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              value
            </label>
            <input
              value={state?.value}
              onChange={handleChange}
              className="focus:shadow-outline h-16 w-full appearance-none rounded-lg border bg-slate-100 py-2 px-3 text-xl leading-tight shadow focus:outline-none dark:bg-slate-800"
              id="value"
              name="value"
              type="number"
              step={0.000001}
              placeholder="value"
              required
            />
          </div>

          <div className="mb-8 flex w-full flex-row items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded-xl border-2 bg-slate-300 py-3 px-4 font-bold shadow-xl hover:border-2 hover:border-[#0db2ac93] hover:bg-slate-100 hover:shadow-sm focus:outline-none dark:bg-slate-800"
              type="submit"
            >
              sign
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal
