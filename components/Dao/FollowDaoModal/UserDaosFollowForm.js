import React from "react"
import { useMutation } from "react-query"
import { reqRelationship } from "query"
import DaoListItem from "./DaoListItem"
import { useDaoStore } from "stores/useDaoStore"



const UserDaosFollowForm = ({userDaos, targetDao}) => {
    {/* get the user's daos */}
    {/* list the user's daos */}
    {/* collect array of bbydao addresses */}
    {/* take each address and follow with map */}
    const [selectedDaos, setSelectedDaos] = React.useState([])
    const { data, status, mutate: followDao } = useMutation(reqRelationship, {
        onSuccess: () => {
            console.log(data)
        }
    })
    const setFollowModalClosed = useDaoStore( state => state.setFollowModalOpen )

    const handleSubmit = React.useCallback(() => {
        if (!userDaos) return
        const selectedUserDaos = userDaos.filter((d, index) => selectedDaos.includes(index))
        selectedUserDaos.map((dao)=>{
            const req = { 
                initiator: dao.address,
                target: targetDao,
                status: 5 
            }
            followDao(req)
        })
        setFollowModalClosed()
    }, [userDaos])
    
    
    

    const handleItemClick = (id) => {
        // get id and add to list
        // or remove 
        if(selectedDaos.includes(id)){
            setSelectedDaos(selectedDaos.filter((e)=> e != id))
        } else {
            setSelectedDaos([id, ...selectedDaos])
        }
    }

    // TODO: sizing of modal and loading states

    return (
        <div className="w-full">
            <ul className="list-none">
                {!userDaos && <p className="items-center">Wait, you haven't joined any bbyDAOs yet :/</p>}
                {userDaos && userDaos.map((dao, index) => {
                    return <DaoListItem daoName={dao.name} isFollowing={false} id={index} onClick={handleItemClick.bind(this)} />
                })}
            </ul>
            
            <button
            className="focus:shadow-outline w-full rounded-xl border-2 bg-slate-300 py-3 px-4 font-bold shadow-xl hover:border-2 hover:border-[#0db2ac93] hover:bg-slate-100 hover:shadow-sm focus:outline-none dark:bg-slate-800"
            onClick={handleSubmit}
            >
            submit
            </button>
        </div>
    )

}

export default UserDaosFollowForm