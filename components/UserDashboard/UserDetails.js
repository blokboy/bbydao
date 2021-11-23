import React from "react"
import { useAccountStore } from "../../stores/useAccountStore"

const UserDetails = () => {
  const userData = useAccountStore(state => state.userData)

  return (
    <div className="flex flex-col mt-4 items-center md:items-start">
      <span className="text-3xl">name</span>
      {userData ? (
        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-600">
          @{userData.username}
        </span>
      ) : (
        <></>
      )}
      <button className="w-max px-4 py-2 mt-4 justify-center rounded-full bg-gray-200 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100">
        edit profile
      </button>
    </div>
  )
}

export default UserDetails
