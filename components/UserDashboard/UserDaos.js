import React from "react"
import DaoDetail from "./DaoDetail"
import index from "../../pages/messages/index"

const UserDaos = ({ safes }) => {
  return (
    <div className="flex flex-col mt-10 md:mt-0">
      <h1 className="mb-4 pl-10 text-xl font-bold underline">my daos</h1>
      <div className="grid grid-cols-2 gap-12 md:gap-6 sm:grid-cols-3 lg:grid-cols-4 justify-items-center mx-4">
        {safes ? (
          safes?.map(safe => <DaoDetail key={index} safe={safe.safes} />)
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default UserDaos
