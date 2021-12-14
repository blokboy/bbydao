import React from "react"
import { useRainbowButton } from "hooks/useRainbowButton"

const DisconnectButton = () => {
  const { disconnect } = useRainbowButton()

  return (
    <button
      className="flex flex-row mr-3 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max"
      onClick={disconnect}
    >
      disconnect
    </button>
  )
}

export default DisconnectButton
