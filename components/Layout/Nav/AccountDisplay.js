import React from "react"
import { useAccountStore } from "stores/useAccountStore"

const AccountDisplay = () => {
  const userData = useAccountStore(state => state.userData)

  if (!userData) return

  return (
    <div className="hidden md:flex flex-row mr-3 rounded-full border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 px-4 py-2 w-max">
      {userData.address ? (
        userData.address.substring(0, 6) +
        "..." +
        userData.address.substring(
          userData.address.length - 5,
          userData.address.length - 1
        )
      ) : (
        <></>
      )}
    </div>
  )
}

export default AccountDisplay
