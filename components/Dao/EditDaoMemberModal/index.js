import React from "react"
import EditDaoMembers from "./EditDaoMembers"
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
    <div className="modal-backdrop" onClick={e => closeEditDaoMemberModal(e)}>
      <div
        className="modal-container"
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
        <div className="w-full text-center text-xl font-bold">
          Edit bbyDAO Members
        </div>
        <EditDaoMembers />
      </div>
    </div>
  )
}

export default EditDaoMemberModal
