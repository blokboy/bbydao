import React             from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import useForm           from "hooks/useForm"
import { useUiStore }    from "stores/useUiStore"
import { useAccount }    from "wagmi"
import { HiX }           from "react-icons/hi"
import * as api          from '../../../query'
import { useMutation }   from "react-query"
import { walletSnippet } from "../../../utils/helpers"

const FollowModal = ({ safeAddress }) => {
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const setFollowDaoModalOpen = useUiStore(state => state.setFollowDaoModalOpen)

  const [{ data, error, loading }, disconnect] = useAccount()

  const [safes, setSafes] = React.useState()
  const { state, setState, handleChange } = useForm()
  const { status, mutateAsync } = useMutation(api.storeTxOffChain)

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
    if (!followDaoModalOpen && e.target) {
      return
    }
    setFollowDaoModalOpen()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!state.safe) {
      // timeout error on ui "please pick a safe"
      console.log("no safe submitted")
      return
    }

    if(safeAddress === state.safe) {
      // user tried to send a friend request between same bbyDAO
      console.log('invalid')
      return { message: `Cannot friend request the same bbyDAO` }
    }
    /*
      Transaction Obj for submission
      {
        safeContract: state.safe,
        creator: data.address,
        receiver: safeAddress,
        approvals: [ data.address ]
        type: 6 (TransactionType.DAO_REQUEST)
      }
    */
    const req = {
      txHash: "DAOTODAO",
      creator: data?.address,
      receiver: safeAddress,
      value: "REQUEST",
      safeContract: state?.safe,
      approvals: [ data?.address ],
      type: 6
    }

    mutateAsync(req)
  }

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <div
        className="z-50 mx-auto mt-24 flex w-full flex-col rounded-xl bg-slate-200 py-6 px-4 shadow dark:bg-slate-900 md:w-6/12"
        onClick={e => closeModal(e)}
      >
        <div className="flex w-full justify-end">
          <button className="modal-close-btn" onClick={e => closeModal(e)}>
            <HiX />
          </button>
        </div>
        <span>{data?.address ? data.address : "not connected"}</span>

        <div className="mb-8">
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
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowModal
