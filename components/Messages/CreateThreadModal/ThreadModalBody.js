import React from "react"
import CreateThreadForm from "./CreateThreadForm"
import { HiX } from "react-icons/hi"

const ThreadModalBody = ({ closeModal }) => {
  return (
    <div
      className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-auto md:w-6/12 md:rounded-xl"
      onClick={e => closeModal(e)}
    >
      <div className="flex w-full justify-end">
        <button className="modal-close-btn" onClick={e => closeModal(e)}>
          <HiX />
        </button>
      </div>
      <CreateThreadForm closeModal={closeModal} />
    </div>
  )
}

export default ThreadModalBody
