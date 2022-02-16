import React from "react"
import { HiX } from "react-icons/hi"

const FriendsModalBody = ({ closeModal }) => {
  return (
    <div
      className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-1/3 md:w-6/12 md:rounded-xl"
      onClick={e => closeModal(e)}
    >
      <div className="flex w-full justify-end">
        <button className="modal-close-btn" onClick={e => closeModal(e)}>
          <HiX />
        </button>
      </div>
      FriendsModalBody
    </div>
  )
}

export default FriendsModalBody
