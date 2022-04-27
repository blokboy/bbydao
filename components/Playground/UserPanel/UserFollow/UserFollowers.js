import React from "react"

const UserFollowers = ({ numFollowers }) => {
  return (
    <div className="flex flex-row space-x-2">
      <div className="font-bold">{numFollowers}</div>
      <div className="flex items-center justify-center font-medium">
        {numFollowers === 1 ? "follower" : "followers"}
      </div>
    </div>
  )
}

export default UserFollowers
