import {useEffect}                from 'react'
import {useMutation}              from "react-query"
import {useAccount, useEnsLookup} from "wagmi"
import * as api                   from "../../query"
import Feed                       from "./Feed"
import UserDaos                   from "./UserDaos"
import UserPanel                  from "./UserPanel"

const Playground = ({address, data}) => {
    // data is the res from querying gnosis for the user's daos
    // address is the address of the profile being viewed
    // data:userData is the data of the signed-in user
    const [{data: userData, error: userErr, loading: userLoading}] = useAccount()
    const [{data: ensData, error: ensError, loading: ensLoading}] = useEnsLookup({address: address})

    const {status, mutateAsync: getUser} = useMutation(api.getUser)
    useEffect(() => {
        if (ensLoading) {
            return
        }
        const req = {address: address, ens: ensData}
        // see if we can adjust our getUser function to update ens
        getUser(req)
    }, [ensLoading])

    // i think there's an opportunity to toggle UserDaos out for another set of components
    // Feed and UserDaos(or a component that contains UserDaos / toggles it out) are intended
    // to interact with each other, actions taken in both sections should lead to discovery
    // and exploration of the app - making each column or section modular could provide unique
    // user paths and experiences - bbyDAO and user discovery/connection
    return (
        <div className="flex w-full flex-col lg:flex-row">
            <UserPanel user={userData?.address} address={address}/>
            <UserDaos user={userData?.address} data={data}/>
            <Feed/>
        </div>
    )
}

export default Playground
