import React from "react"

const BalanceOptionsDropdown = ({ onClick, isOpen, className }) => {
  return isOpen ? (
    <div
      className={`absolute left-0 top-0 right-0 z-50 w-max translate-y-2 -translate-x-2 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white ${className}`}
    >
      <div className="w-full p-2">balance options dropdown</div>
    </div>
  ) : null
}

export default BalanceOptionsDropdown
