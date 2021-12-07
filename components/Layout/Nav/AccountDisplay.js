import React from "react"
import { useAccountStore } from "../../../stores/useAccountStore"

const AccountDisplay = () => {
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <div className="hidden md:flex flex-row mr-3 rounded-full border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 px-4 py-2 w-max">
      {rainbowAccount ? (
        rainbowAccount[0].substring(0, 6) +
        "...." +
        rainbowAccount[0].substring(
          rainbowAccount[0].length - 5,
          rainbowAccount[0].length - 1
        )
      ) : (
        <></>
      )}
    </div>
  )
}

export default AccountDisplay
