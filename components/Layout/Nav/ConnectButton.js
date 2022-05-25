import { useRouter }        from "next/router"
import React from "react"
import ClickAwayListener    from "react-click-away-listener"
import { useConnect }       from "wagmi"

import NetworkDropdown from "./NetworkDropdown"
import { FaEthereum } from "react-icons/fa"

const ConnectButton = () => {
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)
  const { data, error, connect } = useConnect()

  const handleClickAway = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  const handleNetworkSelection = React.useCallback(() => {
    setDropdownOpen(true)
  }, [])


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
        <NetworkDropdown
          isOpen={isDropdownOpen}
          onClick={() => setDropdownOpen(false)}
        />
      </div>
    </ClickAwayListener>
  )
}

export default ConnectButton
