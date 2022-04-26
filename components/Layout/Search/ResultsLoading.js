import React from "react"

const ResultsLoading = () => {
  return (
    // loading state
    <div className="w-full grid grid-cols-2 gap-4 overflow-auto p-2">
      <span className="h-16 animate-pulse rounded bg-slate-300 shadow dark:bg-slate-800"></span>
      <span className="h-16 animate-pulse rounded bg-slate-300 shadow dark:bg-slate-800"></span>
      <span className="h-16 animate-pulse rounded bg-slate-300 shadow dark:bg-slate-800"></span>
      <span className="h-16 animate-pulse rounded bg-slate-300 shadow dark:bg-slate-800"></span>
    </div>
  )
}

export default ResultsLoading
