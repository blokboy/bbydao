import React from "react"

// friend request card
const FriendRequest = ({ body, id }) => {
  return (
    <div className="flex flex-row mb-3 mx-auto rounded-lg bg-gray-50 dark:bg-gray-900 justify-between py-4 px-3 w-11/12 md:w-6/12">
      <span>{body}</span>
      <div>
        <button className="border rounded-lg text-xs mr-4 p-1">accept</button>
        <button className="border rounded-lg text-xs mr-4 p-1">reject</button>
      </div>
    </div>
  )
}

export default FriendRequest
