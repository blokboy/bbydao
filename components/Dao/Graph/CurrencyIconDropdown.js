import React from "react"
import ClickAwayListener from "react-click-away-listener"
import Currencies from "./Currencies"
import CurrencyDropdown from "./CurrencyDropdown"

const CurrencyIconDropdown = () => {
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  // function that sets currency bbydao net worth is displayed in, as well as the icon in the button
  const currency = () => {
    // will be adjusted when other currencies are available and given ids
    const match = Currencies.find(currency => currency.id === 1)

    return match
  }

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
          {currency().icon}
        </button>
        <CurrencyDropdown
          isOpen={isDropdownOpen}
          onClick={handleClick}
          className="-translate-x-64 translate-y-8 md:-translate-x-80"
        />
      </div>
    </ClickAwayListener>
  )
}

export default CurrencyIconDropdown
