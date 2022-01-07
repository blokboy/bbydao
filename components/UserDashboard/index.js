import React from "react"
import Head from "next/head"
import UserImage from "./UserImage"
import UserDetails from "./UserDetails"
import UserFriends from "./UserFriends"
import UserBio from "./UserBio"
import UserDaos from "./UserDaos"

const UserDashboard = ({ data }) => {
  const { id, address } = data

  return (
    <>
      <Head>
        <title>{`babydao | ${address}`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col md:flex-row w-full mt-10">
        <div className="flex flex-col flex-start md:w-3/12 px-4 md:px-10">
          <UserImage />
          <UserDetails id={id} address={address} />
          <UserFriends />
          <UserBio />
        </div>
        <div className="flex flex-col md:w-9/12 px-10">
          <UserDaos />
        </div>
      </div>
    </>
  )
}

export default UserDashboard
