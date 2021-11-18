import React from "react"
import { useRainbowButton } from "../../../hooks/useRainbowButton"

const DisconnectButton = () => {
  const { disconnect } = useRainbowButton()

  return (
    <button
      className="w-max px-4 mr-3 py-2 justify-center rounded-full bg-gray-200 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100"
      onClick={disconnect}
    >
      disconnect
    </button>
  )
}

export default DisconnectButton
