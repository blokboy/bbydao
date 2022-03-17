import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useUiStore } from "stores/useUiStore"

const networks = ["ethereum", "arbitrum", "optimism", "avalanche", "polygon"]

const ConnectButton = () => {
  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  const handleConnect = React.useCallback(() => {
    setConnectModalOpen()
  })

  const handleClickAway = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  const handleNetworkSelection = React.useCallback(() => {
    setDropdownOpen(true)
  }, [])

  const dropdown = React.useMemo(() => {
    return isDropdownOpen ? (
      <div className="absolute top-0 right-0 z-50 h-auto w-full origin-top-right translate-y-20 -translate-x-4 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white -mt-2 md:-mr-2 md:-mt-4 md:w-48">
        <ul className="py-4 px-2">
          {networks.map(network => (
            <li key={network} className="mt-2">
              <button
                type="button"
                disabled={network !== "ethereum"}
                onClick={network === "ethereum" ? handleConnect : () => {}}
                className="capitalize font-bold w-full text-left text-sm"
              >
                {network}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : null
  }, [isDropdownOpen])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="relative">
        <button
          className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          onClick={handleNetworkSelection}
        >
          <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
            connect
          </span>
        </button>
        {dropdown}
      </div>
    </ClickAwayListener>
  )
}

export default ConnectButton
