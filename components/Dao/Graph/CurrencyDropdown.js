import React from "react"
import Currencies from "./Currencies"

const CurrencyDropdown = ({ onClick, isOpen, className }) => {
  const handleCurrencySelect = React.useCallback(() => {
    onClick()
  }, [onClick])

  return isOpen ? (
    <div
      className={`absolute left-0 top-0 right-0 z-50 w-36 translate-y-2 -translate-x-2 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white ${className}`}
    >
      <div className="w-full">
        <ul className="m-auto">
          {Currencies.map(({ name, icon }) => (
            <li key={name}>
              <div className="menu-link">
                <div className="mr-4 self-center text-center">{icon}</div>
                <button
                  type="button"
                  onClick={handleCurrencySelect}
                  className="w-full text-left text-sm font-bold capitalize"
                >
                  {name}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null
}

export default CurrencyDropdown
