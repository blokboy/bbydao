import React from "react"
import { BiUserCheck } from "react-icons/bi"

const UserFollowers = ({ numFollowers, friendStatus }) => {

  // handle click opens modal UserFollowers Modal

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <button className="flex flex-row space-x-1 hover:text-teal-300">
        <div className="font-bold">{numFollowers}</div>
        <div className="flex items-center justify-center font-medium">
          {numFollowers === 1 ? " follower" : " followers"}
        </div>
      </button>
      {friendStatus?.isFollowing ? (
        <div className="flex items-center justify-center rounded-full border border-teal-300 bg-slate-200 p-1 dark:bg-slate-800">
          <BiUserCheck size={18} />
        </div>
      ) : null}
    </div>
  )
}

export default UserFollowers
