import React from "react"
import DaoListItem from "./DaoListItem"
import { getUserDao } from "query"


const UserDaosFollowForm = ({user, targetDao}) => {
    {/* get the user's daos */}
    {/* list the user's daos */}
    {/* collect array of bbydao addresses */}
    {/* take each address and follow with map */}
    const { status, mutateAsync } = useMutation(getUserDao)



    const handleSubmit = () => {
        console.log("UserDaosFollowForm Submit")
    }

    const handleItemClick = (id) => {
        // get id and add to list
        // or remove 
        console.log(id)
    }





    return (
        <div className="w-full">
            <p>Wait, you haven't joined any bbyDAOs yet :/</p>
            <ul className="list-none">
                <DaoListItem daoName={"super bbyDAO"} isFollowing={true} id={1} onClick={handleItemClick.bind(this)} />
                <DaoListItem daoName={"super saiyan bbyDAO"} id={2} onClick={handleItemClick.bind(this)} />
                <DaoListItem daoName={"super saiyan God bbyDAO"} id={3} onClick={handleItemClick.bind(this)} />
                <DaoListItem daoName={"super saiyan God super saiyan bbyDAO"} id={4} onClick={handleItemClick.bind(this)} />
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