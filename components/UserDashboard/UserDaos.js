import React from "react"
import DaoDetail from "./DaoDetail"

const UserDaos = () => {
  return (
    <div className="flex flex-col mt-10 md:mt-0">
      <h1 className="mb-4 pl-10">My Daos</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center mx-4">
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
      </div>
    </div>
  )
}

export default UserDaos
