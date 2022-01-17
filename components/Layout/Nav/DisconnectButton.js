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
      className="flex flex-row mr-3 rounded-full shadow bg-slate-100 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:shadow-orange-300 dark:hover:shadow-sm dark:hover:shadow-orange-900 px-4 py-2 w-max"
      onClick={handleDisconnect}
    >
      disconnect
    </button>
  )
}

export default DisconnectButton
