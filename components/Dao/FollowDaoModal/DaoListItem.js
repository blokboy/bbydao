import React from "react"
import { HiCheckCircle } from 'react-icons/hi'
import { useMutation } from "react-query"
import { getFriends, getRelationship } from "query"

const DaoListItem = ({dao, id, targetDao, onClick}) => {
    {/* use Dao addess to check if a dao is already following a dao */}
    {/* place a green check at the end if so */}
    const [selected, setSelected] = React.useState(false)
    const [isFollowing, setIsFollowing] = React.useState(false);
    const {data ,mutateAsync: getDaoRelationship } = useMutation(getRelationship)

    React.useEffect(()=>{

        const req = {
            "initiator": dao.address,
            "target": targetDao
        }

        getDaoRelationship(req).then((res) => {
            const follow = res.filter((relationship) => 
                relationship.initiator == dao.address 
                && relationship.target == targetDao 
                && relationship.status == 4
            )

            setIsFollowing(follow.length >= 1)

        }).catch((e)=>{
            console.log(e);
        })

    }, [])

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
                <p>{dao.name}</p>
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
