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
    </div>
  )
}

export default UserDetails
