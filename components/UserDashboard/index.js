import React from "react"
import Head from "next/head"
import UserImage from "./UserImage"
import UserDetails from "./UserDetails"
import UserFriends from "./UserFriends"
import UserBio from "./UserBio"
import UserDaos from "./UserDaos"
import DaoForm from "../Forms/DaoForm"
import { useUiStore } from "stores/useUiStore"
import { useConnect } from "wagmi"

const UserDashboard = ({ data }) => {
  const { id, address } = data.user
  const [{ data: connectData, error, loading }, connect] = useConnect()
  const createDaoModalOpen = useUiStore(state => state.createDaoModalOpen)

  console.log("UserDashboard user:", data)
  console.log("UserDashboard useConnect:", connectData)

  if (!connectData.connected) {
    console.log("prompt connect")
    return <div>prompt connect</div>
  }

  return (
    <>
      <Head>
        <title>{`babydao | ${address.substring(0, 6)}...`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data ? (
        <>
          {createDaoModalOpen ? <DaoForm address={address} /> : <></>}
          <div className="flex flex-col md:flex-row w-full mt-10">
            <div className="flex flex-col flex-start md:w-3/12 px-4 md:px-10">
              <UserImage />
              <UserDetails id={id} address={address} />
              <UserFriends id={id} />
              <UserBio />
            </div>
            <div className="flex flex-col md:w-9/12 px-10">
              <UserDaos safes={[data.safes]} />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default UserDashboard
