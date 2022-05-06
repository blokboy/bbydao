import React           from "react"
import Modal           from "../../Layout/Modal"
import { useMutation } from "react-query"
import { useDaoStore } from "stores/useDaoStore"
import { getUserDao } from "query"

import UserDaosFollowForm from "./UserDaosFollowForm"
import useSafes from "hooks/useSafes"


const FollowDaoModal = ({user, targetDao}) => {
  const safes = useSafes(user)
  const { data: userDaos, mutateAsync: getUserDaos } = useMutation(getUserDao)

  const setFollowModalOpen = useDaoStore(
    state => state.setFollowModalOpen
  )

  React.useEffect(()=>{
    if(!safes) return 
    
    const req = safes.map((s)=> {
      return {
        "address": s
      }
    })

    getUserDaos(req)

  },[safes])


  return (
    <Modal
      close={setFollowModalOpen}
      heading={"Which bbyDAO(s) should follow this?"}
    >
        <div className="w-full md:h-60 lg:h-80 sm:h-40 py-5 justify-center items-center">
            <UserDaosFollowForm userDaos={userDaos} targetDao={targetDao} /> 
        </div>
        
    </Modal>
  )
}

export default FollowDaoModal