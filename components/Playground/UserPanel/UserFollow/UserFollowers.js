import React from "react"
import { BiUserCheck } from "react-icons/bi"

const UserFollowers = ({ numFollowers, friendStatus }) => {
  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <div className="font-bold">{numFollowers}</div>
      <div className="flex items-center justify-center font-medium">
        {numFollowers === 1 ? "follower" : "followers"}
      </div>
      {friendStatus?.isFollowing ? (
        <div className="flex items-center justify-center rounded-full border bg-slate-200 dark:bg-slate-800 border-teal-300 p-1">
          <BiUserCheck size={18} />
        </div>
      ) : null}
    </div>
  )
}

export default UserFollowers
