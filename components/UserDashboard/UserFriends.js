import React from "react"

const UserFriends = () => {
  const num = 143

  return (
    <div className="flex flex-col my-10 items-center md:items-start">
      <span>{num} friends</span>
      <div className="flex flex-row mt-4">
        <div className="w-12 h-12 rounded-full border border-white bg-gray-200 dark:bg-gray-900"></div>
        <div className="w-12 h-12 rounded-full border border-white -ml-3 bg-gray-200 dark:bg-gray-900"></div>
        <div className="w-12 h-12 rounded-full border border-white -ml-3 bg-gray-200 dark:bg-gray-900"></div>
        <div className="w-12 h-12 rounded-full border border-white -ml-3 bg-gray-200 dark:bg-gray-900"></div>
      </div>
      <span>view all</span>
    </div>
  )
}

export default UserFriends
