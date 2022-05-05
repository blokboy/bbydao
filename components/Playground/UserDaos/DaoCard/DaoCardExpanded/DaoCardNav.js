import React from "react"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"

const DaoCardNav = () => {
  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)
  const setExpandedPanel = usePlaygroundStore(state => state.setExpandedPanel)

  const handleSetPanel = React.useCallback(
    panel => {
      if (panel === expandedPanel) {
        return
      }
      setExpandedPanel(panel)
    },
    [expandedPanel, setExpandedPanel]
  )

  return (
    <div className="my-2 flex flex-row space-x-2 rounded-xl bg-slate-300 p-2 dark:bg-slate-700">
      <button
        type="button"
        className={
          "flex w-full flex-col items-center justify-center rounded-lg border bg-slate-100 text-center text-sm hover:border-white hover:bg-slate-200 dark:bg-slate-600 dark:hover:border-white dark:hover:bg-slate-500 " +
          (expandedPanel === "nfts"
            ? " border-teal-300 dark:border-teal-300"
            : "border-slate-100 dark:border-slate-600")
        }
        onClick={() => handleSetPanel("nfts")}
      >
        nfts
      </button>
      <button
        type="button"
        className={
          "flex w-full flex-col items-center justify-center rounded-lg border bg-slate-100 text-center text-sm hover:border-white hover:bg-slate-200 dark:bg-slate-600 dark:hover:border-white dark:hover:bg-slate-500 " +
          (expandedPanel === "tokens"
            ? " border-teal-300 dark:border-teal-300"
            : "border-slate-100 dark:border-slate-600")
        }
        onClick={() => handleSetPanel("tokens")}
      >
        tokens
      </button>
      <button className="flex w-full flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-100 text-center text-sm hover:border-white hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:hover:border-white dark:hover:bg-slate-500">
        stats
      </button>
      <button
        className={
          "flex w-full flex-col items-center justify-center rounded-lg border bg-slate-100 text-center text-sm hover:border-white hover:bg-slate-200 dark:bg-slate-600 dark:hover:border-white dark:hover:bg-slate-500 " +
          (expandedPanel === "info"
            ? " border-teal-300 dark:border-teal-300"
            : "border-slate-100 dark:border-slate-600")
        }
        onClick={() => handleSetPanel("info")}
      >
        info
      </button>
    </div>
  )
}

export default DaoCardNav
