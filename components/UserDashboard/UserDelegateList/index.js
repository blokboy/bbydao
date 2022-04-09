import React from "react"
import DelegateListDaoCard from "./DelegateListDaoCard"
import { BsGear } from "react-icons/bs"

const UserDelegateList = ({ safes }) => {
  return (
    <div className="w-full space-y-2 p-3">
      <div className="rounded-xl border p-2">
        <div className="flex flex-col space-y-2">
          {safes
            ? safes?.map((safe, index) => (
                <DelegateListDaoCard key={index} safe={safe} />
              ))
            : null}
        </div>
      </div>
    </div>
  )
}

export default UserDelegateList
