import React from "react"
import { useDaoStore } from "stores/useDaoStore"
import { HiX } from "react-icons/hi"

const EditDaoMemberModal = () => {
  const editDaoMemberModalOpen = useDaoStore(
    state => state.editDaoMemberModalOpen
  )
  const setEditDaoMemberModalOpen = useDaoStore(
    state => state.setEditDaoMemberModalOpen
  )

  const closeEditDaoMemberModal = e => {
    if (editDaoMemberModalOpen && e.target) {
      setEditDaoMemberModalOpen()
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeEditDaoMemberModal(e)}
    >
      <div
        className="z-50 mx-auto mt-0 flex h-full w-full flex-col items-center bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-auto md:w-6/12 md:rounded-xl"
        onClick={e => closeEditDaoMemberModal(e)}
      >
        <div className="flex w-full justify-end">
          <button
            className="modal-close-btn"
            onClick={e => closeEditDaoMemberModal(e)}
          >
            <HiX />
          </button>
        </div>
        <div className="mb-6 w-full text-center text-xl font-bold">
          Edit bbyDAO Members
        </div>
      </div>
    </div>
  )
}

export default EditDaoMemberModal
