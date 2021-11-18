import React from "react"
import { useAccountStore } from "../../../stores/useAccountStore"

const AccountDisplay = () => {
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <div className="w-max px-4 mr-3 py-2 justify-center border border-gray-400 rounded-full bg-gray-200 dark:bg-gray-900 dark:text-gray-100">
      {rainbowAccount[0].substring(0, 6) +
        "...." +
        rainbowAccount[0].substring(
          rainbowAccount[0].length - 5,
          rainbowAccount[0].length - 1
        )}
    </div>
  )
}

export default AccountDisplay
