import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useNetwork } from "wagmi"

import Networks from "./Networks"
import NetworkDropdown from "./NetworkDropdown"

export default function NetworkIconDropdown() {
  const { activeChain } = useNetwork()
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  const network = React.useMemo(() => {
    if (!activeChain) {
      return null
    }

    const match = Networks.find(network => network.id === activeChain?.id)
    return match || null
  }, [activeChain])

  const handleClickAway = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  const handleOpen = React.useCallback(() => {
    if (!isDropdownOpen) {
      setDropdownOpen(true)
    }
  }, [isDropdownOpen])

  const handleClick = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="relative flex w-full items-center justify-center">
        <button
          type="button"
          className="nav-btn"
          onClick={handleOpen}
        >
          {network?.icon}
        </button>
        <NetworkDropdown isOpen={isDropdownOpen} onClick={handleClick} className="-translate-x-12" />
      </div>
    </ClickAwayListener>
  )
}
