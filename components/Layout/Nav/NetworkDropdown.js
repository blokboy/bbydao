import React from "react"

import { useUiStore } from "stores/useUiStore"
import Networks from "./Networks"

export default function NetworkDropdown({ onClick, isOpen, className }) {
  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  const handleConnect = React.useCallback(() => {
    console.log("handleConnect")
    onClick()
    setConnectModalOpen()
  })

  return isOpen ? (
    <div
      className={`absolute left-0 top-0 right-0 z-50 w-36 translate-y-16 -translate-x-2 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white ${className}`}
    >
      <div className="w-full">
        <ul className="m-auto">
          {Networks.map(({ name, icon }) => (
            <li key={name}>
              <div className="menu-link">
                <div className="mr-4 self-center text-center">{icon}</div>
                <button
                  type="button"
                  disabled={name !== "ethereum"}
                  onClick={name === "ethereum" ? handleConnect : () => {}}
                  className="w-full text-left text-sm font-bold capitalize disabled:opacity-50"
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
