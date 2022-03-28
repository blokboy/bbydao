import React from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import { HiX } from "react-icons/hi"

import { useMutation } from "react-query"
import { useAccount } from "wagmi"
import * as api from "../../../query"
import { useUiStore } from "stores/useUiStore"

export default function UnfriendModal() {
  const unfriendModalOpen = useUiStore(state => state.unfriendModalOpen)
  // const setUnfriendModalOpen = useUiStore(state => state.setUnfriendModalOpen)

  const friendStatus = useUiStore(state => state.unfriendModalFriendStatus)
  const setFriendStatus = useUiStore(
    state => state.setUnfriendModalFriendStatus
  )

  const router = useRouter()
  const [{ data }] = useAccount()

  const [isMakingRequest, setMakingRequest] = React.useState(false)

  const { mutateAsync } = useMutation(api.updateRelationship, {
    onSuccess: () => {
      friendStatus?.refetch()
      setMakingRequest(false)
    },
  })

  const closeModal = React.useCallback(() => {
    if (unfriendModalOpen) {
      setFriendStatus(null)
    }
  }, [unfriendModalOpen])

  const modalText = React.useMemo(() => {
    if (!friendStatus) {
      return "..."
    }
    return friendStatus.isRequested
      ? "Are you sure you want to cancel this fren request?"
      : "Are you sure you want to unfren?"
  }, [friendStatus])

  const handleUnfriend = React.useCallback(() => {
    if (!data || !friendStatus.data) {
      return
    }

    mutateAsync({
      id: friendStatus.data.id,
      status: 0,
    })

    setMakingRequest(true)

    closeModal()
  }, [data, friendStatus, closeModal, router, setMakingRequest])

  return unfriendModalOpen
    ? createPortal(
        <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center overflow-y-auto bg-slate-600 bg-opacity-50 md:items-start">
          <div className="z-50 mx-auto flex h-auto w-full max-w-xs flex-col rounded-xl bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24">
            <div className="flex w-full items-center justify-end py-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border px-2 py-1 dark:text-white"
              >
                <HiX />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>{modalText}</p>
              <button
                type="button"
                className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white disabled:cursor-not-allowed disabled:cursor-not-allowed dark:bg-slate-900 dark:hover:bg-slate-700"
                onClick={handleUnfriend}
                disabled={isMakingRequest}
              >
                {isMakingRequest ? (
                  "updating fren status..."
                ) : (
                  <>{friendStatus.isRequested ? "cancel request" : "unfren"}</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.querySelector("body")
      )
    : null
}
