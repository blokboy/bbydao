import React from "react"
import UserInfo from "./UserInfo"
import Feed from "./Feed"
import UserDaos from "./UserDaos"
import { useAccount } from "wagmi"

const Playground = ({ address, data }) => {
  // data is the res from querying gnosis for the user's daos
  // address is the address of the profile being viewed
  // data:userData is the data of the signed-in user
  const [{ data: userData, error: userErr, loading: userLoading }, disconnect] = useAccount()

  // i think there's an opportunity to toggle UserDaos out for another set of components
  // Feed and UserDaos(or a component that contains UserDaos / toggles it out) are intended
  // to interact with each other, actions taken in both sections should lead to discovery
  // and exploration of the app - making each column or section modular could provide unique 
  // user paths and experiences - bbyDAO and user discovery/connection
  return (
    <div className="flex lg:flex-row flex-col w-full">
      <UserInfo address={address} />
      <UserDaos user={userData?.address} data={data} />
      <Feed />
    </div>
  )
}

export default Playground
