import React           from "react"
import Modal           from "../../Layout/Modal"
import { useMutation } from "react-query"
import { useDaoStore } from "stores/useDaoStore"
import { getUserDao } from "query"

import UserDaosFollowForm from "./UserDaosFollowForm"
import useSafes from "hooks/useSafes"


const FollowDaoModal = ({user, targetDao}) => {
  const safes = useSafes(user)
  const [userDaos, setUserDaos] = React.useState()
  const { data, status, mutateAsync: getUserDaos } = useMutation(getUserDao)

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
        <div className="w-full h-full justify-center items-center">
            <UserDaosFollowForm userDaos={data} targetDao={targetDao} /> 
        </div>
        
    </Modal>
  )
}

export default FollowDaoModal