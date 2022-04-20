import React           from "react"
import Modal           from "../../Layout/Modal"
import EditDaoMembers  from "./EditDaoMembers"
import { useDaoStore } from "stores/useDaoStore"
import { HiX }         from "react-icons/hi"

const EditDaoMemberModal = () => {
  const setEditDaoMemberModalOpen = useDaoStore(
    state => state.setEditDaoMemberModalOpen
  )

  return (
    <Modal
      close={setEditDaoMemberModalOpen}
      heading={'Edit Dao Members'}
    >
        <EditDaoMembers />
    </Modal>
  )
}

export default EditDaoMemberModal
