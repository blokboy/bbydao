import React from "react"
import { HiCheckCircle } from 'react-icons/hi'

const DaoListItem = ({daoName, isFollowing, id, onClick}) => {
    {/* use Dao addess to check if a dao is already following a dao */}
    {/* place a green check at the end if so */}
    {/* switch to red x if user wants to unfollow */}
    const [selected, setSelected] = React.useState(false)


    const handleClick = () => {
        setSelected(!selected)
        onClick(id)
    }

    return (
        <li className={`mb-2 flex w-full flex-row justify-between items-center rounded-lg bg-slate-100 p-3 dark:bg-slate-900 cursor-pointer ${ selected && "border-2 border-[#0db2ac93]"}`} 
            id={id}
            onClick={handleClick}
        >
            <div className="flex flex-row justify-between">
                <p>{daoName}</p>
            </div>
            {isFollowing && (
                <div className="flex flex-row text-green-300"
                    title="this bbyDAO already follows it">
                    <HiCheckCircle />
                </div>
            )}
            
        </li>
    )
}

export default DaoListItem
