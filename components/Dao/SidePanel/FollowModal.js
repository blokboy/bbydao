import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import useForm from "hooks/useForm"
import { useUiStore } from "stores/useUiStore"
import { useAccount } from "wagmi"

const FollowModal = ({ safeAddress }) => {
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const setFollowDaoModalOpen = useUiStore(state => state.setFollowDaoModalOpen)

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
    if (!followDaoModalOpen && e.target) {
      return
    }
    setFollowDaoModalOpen()
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
                    {safe.substring(0, 6) +
                      "..." +
                      safe.substring(safe.length - 5, safe.length - 1)}
                  </label>
                </div>
              ))
            : "no safes"}
        </div>
      </div>
    </div>
  )
}

export default FollowModal
