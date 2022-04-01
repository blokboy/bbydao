import React             from "react"
import { useOsStore }    from "stores/useOsStore"
import { useAccount }    from "wagmi"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import useForm           from "hooks/useForm"
import * as api          from 'query'
import { useMutation }   from "react-query"
import { walletSnippet } from "../../../utils/helpers"

const SellModal = ({ safeAddress }) => {
  const osSellModalOpen = useOsStore(state => state.osSellModalOpen)
  const setOsSellModalOpen = useOsStore(state => state.setOsSellModalOpen)
  const osAssetInfo = useOsStore(state => state.osAssetInfo)
  const setOsAssetInfo = useOsStore(state => state.setOsAssetInfo)

  const {
    data: storeTxData,
    status: storeTxStatus,
    mutateAsync: storeTxOffChain,
  } = useMutation(api.storeTxOffChain)

  const [{ data, error, loading }, disconnect] = useAccount()

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
    if (!osSellModalOpen && e.target) {
      return
    }
    setOsSellModalOpen()
    // setOsAssetInfo({})
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(osAssetInfo)
    if (!state.safe || !osAssetInfo) {
      // timeout error on ui "please pick a safe"
      console.log("no safe submitted or no asset info retrieved")
      return
    }

    const tx = {
      txHash: "OPENSEA",
      type: 3,
      approvals: [data?.address],
      value: state.offerValue,
      safeContract: state.safe,
      tokenId: osAssetInfo.token_id,
      tokenContract: osAssetInfo.address,
      receiver: osAssetInfo.image_url
    }

    const storedTx = await storeTxOffChain(tx)
    console.log('stored tx ', storedTx)
  }

  if (!osSellModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <div
        className="z-50 mx-auto mt-24 flex w-full flex-col rounded-xl bg-slate-200 py-6 px-4 shadow dark:bg-slate-900 md:w-6/12"
        onClick={e => closeModal(e)}
      >
        <span>{data?.address ? data.address : "not connected"}</span>
        <span>{osAssetInfo?.address}</span>
        <span>{osAssetInfo?.token_id}</span>

        {/* form to get proposed offer value */}
        {/* onSubmit make offer */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            {/* iterate through safes into radio input buttons, value will be picked up by useForm */}
            {safes?.length
              ? safes?.map((safe, index) => (
                  <div className="" key={index}>
                    <input
                      type="radio"
                      name="safe"
                      checked={state.safe === safe}
                      onChange={handleChange}
                      value={safe}
                    />
                    <label className="bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text pl-4 font-semibold text-transparent">
                      {walletSnippet(safe)}
                    </label>
                  </div>
                ))
              : "no safes"}

            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              value
            </label>
            <input
              value={state.offerValue || ""}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
              id="offerValue"
              name="offerValue"
              type="number"
              placeholder="value"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
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

export default SellModal
