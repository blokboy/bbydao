import React from "react"
import { HiAdjustments } from "react-icons/hi"
import ClickAwayListener from "react-click-away-listener"
import BalanceOptionsDropdown from "./BalanceOptionsDropdown"

const BalanceOptionsIcon = () => {
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

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
        <button className="icon-util-btn" type="button" onClick={handleOpen}>
          <HiAdjustments size={18} />
        </button>
        <BalanceOptionsDropdown
          isOpen={isDropdownOpen}
          onClick={handleClick}
          className="-translate-x-64 translate-y-4"
        />
      </div>
    </ClickAwayListener>
  )
}

export default BalanceOptionsIcon
