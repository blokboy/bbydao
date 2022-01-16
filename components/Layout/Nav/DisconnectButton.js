import React from "react"
import { useAccount } from "wagmi"
import { useAccountStore } from "stores/useAccountStore"

const DisconnectButton = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  const setUserData = useAccountStore(state => state.setUserData)

  const handleDisconnect = () => {
    setUserData(null)
    useAccountStore.persist.clearStorage()
    useAccountStore.destroy()
    disconnect()
  }

  return (
    <button
      className="flex flex-row mr-3 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max"
      onClick={handleDisconnect}
    >
      disconnect
    </button>
  )
}

export default DisconnectButton
