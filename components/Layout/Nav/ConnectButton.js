import React from "react"
import { useAccount } from "wagmi"
import { useUiStore } from "stores/useUiStore"

const ConnectButton = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  const connectModalOpen = useUiStore(state => state.connectModalOpen)
  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  // const setUserData = useAccountStore(state => state.setUserData)

  const handleConnect = () => {
    setConnectModalOpen()
    // setUserData(null)
    // useAccountStore.persist.clearStorage()
    // useAccountStore.destroy()
    // disconnect()
  }

  return (
    <button
      className="flex flex-row mr-3 shadow p-0.5 rounded-full bg-gradient-to-r hover:bg-gradient-to-l from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] transform hover:-translate-x-0.5 transition duration-500 ease-in-out hover:bg-white dark:hover:bg-slate-700 w-max"
      onClick={handleConnect}
    >
      <span className="block px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:text-white bg-slate-200 dark:bg-slate-900 rounded-full hover:bg-opacity-50 dark:hover:bg-opacity-75">
        connect
      </span>
    </button>
  )
}

export default ConnectButton
