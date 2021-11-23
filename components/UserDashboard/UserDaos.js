import React from "react"
import DaoDetail from "./DaoDetail"
import CreateDaoPrompt from "./CreateDaoPrompt"

const UserDaos = () => {
  return (
    <div className="flex flex-col mt-10 md:mt-0">
      <h1 className="mb-4 pl-10 text-xl font-bold underline">my daos</h1>

      <CreateDaoPrompt />

      {/* <div className="grid grid-cols-2 gap-12 md:gap-6 sm:grid-cols-3 lg:grid-cols-4 justify-items-center mx-4">
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
        <DaoDetail />
      </div> */}
    </div>
  )
}

export default UserDaos
