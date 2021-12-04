import React from "react"
import { useAccountStore } from "../../stores/useAccountStore"

const UserDetails = ({ username }) => {
  const userData = useAccountStore(state => state.userData)

  return (
    <div className="flex flex-col mt-4 items-center md:items-start">
      <span className="text-3xl">name</span>
      {username ? (
        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-600">
          @{username}
        </span>
      ) : (
        <></>
      )}

      {userData?.username === username ? (
        <button className="mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
          edit profile
        </button>
      ) : (
        <button className="mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
          add friend
        </button>
      )}
    </div>
  )
}

export default UserDetails
