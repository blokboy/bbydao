import React           from "react"
import Modal           from "../../Layout/Modal"
import { useDaoStore } from "stores/useDaoStore"

import UserDaosFollowForm from "./UserDaosFollowForm"

const FollowDaoModal = ({user, targetDao}) => {
  const setFollowModalOpen = useDaoStore(
    state => state.setFollowModalOpen
  )

  return (
    <Modal
      close={setFollowModalOpen}
      heading={"Which bbyDAO's should follow this?"}
    >
        {console.log("bang bang")}
         <div className="w-full h-full justify-center items-center">
            <UserDaosFollowForm user={user} targetDao={targetDao} />
         </div>
        
    </Modal>
  )
}

export default FollowDaoModal