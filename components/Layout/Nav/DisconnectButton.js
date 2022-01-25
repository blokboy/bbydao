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
      className="mr-3 flex w-max flex-row rounded-full bg-slate-100 px-4 py-2 shadow hover:bg-white hover:shadow-sm hover:shadow-orange-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:shadow-sm dark:hover:shadow-orange-900"
      onClick={handleDisconnect}
    >
      disconnect
    </button>
  )
}

export default DisconnectButton
