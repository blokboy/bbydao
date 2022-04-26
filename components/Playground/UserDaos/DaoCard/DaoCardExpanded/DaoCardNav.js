import React from "react"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"

const DaoCardNav = () => {
  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)
  const setExpandedPanel = usePlaygroundStore(state => state.setExpandedPanel)

  const handleSetPanel = React.useCallback((panel) => {
    if (panel === expandedPanel) {
      return 
    }
    setExpandedPanel(panel)
  }, [expandedPanel, setExpandedPanel])

  return (
    <div className="flex flex-row space-x-2 p-2 my-2 dark:bg-slate-700 bg-slate-300 rounded-xl">
      <button
        type="button"
        className={"flex flex-col items-center justify-center w-full text-center text-sm border hover:border-white dark:hover:border-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg " + (expandedPanel === "nfts" ? " dark:border-teal-300 border-teal-300" : "border-slate-100 dark:border-slate-600")}
        onClick={() => handleSetPanel("nfts")}
        >
        nfts
      </button>
      <button
        type="button"
        className={"flex flex-col items-center justify-center w-full text-center text-sm border hover:border-white dark:hover:border-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg " + (expandedPanel === "tokens" ? " dark:border-teal-300 border-teal-300" : "border-slate-100 dark:border-slate-600")}
        onClick={() => handleSetPanel("tokens")}
      >
        tokens
      </button>
      <button className="flex flex-col items-center justify-center w-full text-center text-sm border border-slate-100 dark:border-slate-600 hover:border-white dark:hover:border-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg">
        stats
      </button>
      <button className="flex flex-col items-center justify-center w-full text-center text-sm border border-slate-100 dark:border-slate-600 hover:border-white dark:hover:border-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg">
        info
      </button>
    </div>
  )
}

export default DaoCardNav
