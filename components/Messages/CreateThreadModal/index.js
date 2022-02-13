import React from "react"
import ModalBody from "./ModalBody"
import { useUiStore } from "stores/useUiStore"

const CreateThreadModal = () => {
  const createThreadModalOpen = useUiStore(state => state.createThreadModalOpen)
  const setCreateThreadModalOpen = useUiStore(
    state => state.setCreateThreadModalOpen
  )

  const closeModal = e => {
    if (!createThreadModalOpen && e.target) {
      return
    }
    setCreateThreadModalOpen()
  }

  if (!createThreadModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <ModalBody />
    </div>
  )
}

export default CreateThreadModal
