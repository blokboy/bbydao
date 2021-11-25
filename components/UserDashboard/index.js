import React from "react"
import UserImage from "./UserImage"
import UserDetails from "./UserDetails"
import UserFriends from "./UserFriends"
import UserBio from "./UserBio"
import UserDaos from "./UserDaos"
import DaoForm from "./DaoForm"

const UserDashboard = ({ data }) => {
  const { username } = data

  return (
    <div className="flex flex-col md:flex-row w-full mt-10">
      <div className="flex flex-col flex-start md:w-3/12 px-4 md:px-10">
        <UserImage />
        <UserDetails username={username} />
        <UserFriends />
        <UserBio />
      </div>
      <div className="flex flex-col md:w-9/12 px-10">
        <UserDaos />
      </div>
      {/* <DaoForm /> */}
    </div>
  )
}

export default UserDashboard
