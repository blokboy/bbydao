import React from "react"
import { useUiStore } from "stores/useUiStore"

const ConnectButton = () => {
  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  const handleConnect = () => {
    setConnectModalOpen()
  }

  return (
    <button
      className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
      onClick={handleConnect}
    >
      <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
        connect
      </span>
    </button>
  )
}

export default ConnectButton
