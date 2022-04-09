import React from "react"
import Currencies from "./Currencies"

const CurrencyDropdown = ({ onClick, isOpen, className }) => {
  const handleCurrencySelect = React.useCallback(() => {
    onClick()
  }, [onClick])

  return isOpen ? (
    <div
      className={`absolute left-0 top-0 right-0 z-50 w-max translate-y-2 -translate-x-2 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white ${className}`}
    >
      <div className="w-full p-2">
        <ul className="m-auto grid grid-cols-4 gap-2">
          {Currencies.map(({ name, icon }) => (
            <li key={name}>
              <div className="flex flex-row space-x-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="self-center text-center">{icon}</div>
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
