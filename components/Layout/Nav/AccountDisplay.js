import React from "react"
import { useAccountStore } from "../../../stores/useAccountStore"

const AccountDisplay = () => {
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <div className="hidden md:flex px-4 -mr-9 py-2 justify-center border border-gray-400 rounded-xl shadow-inner bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
      {rainbowAccount ? rainbowAccount[0].substring(0, 6) + "......." : <></>}
    </div>
  )
}

export default AccountDisplay
