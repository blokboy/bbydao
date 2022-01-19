import React from "react"

const OsResults = () => {
  return (
    // loading state
    <div className="grid gap-4 grid-cols-2 py-4 px-2 max-h-96 overflow-auto">
      <span className="animate-pulse bg-slate-300 dark:bg-slate-800 h-16 rounded shadow"></span>
      <span className="animate-pulse bg-slate-300 dark:bg-slate-800 h-16 rounded shadow"></span>
      <span className="animate-pulse bg-slate-300 dark:bg-slate-800 h-16 rounded shadow"></span>
      <span className="animate-pulse bg-slate-300 dark:bg-slate-800 h-16 rounded shadow"></span>
    </div>
  )
}

export default OsResults
