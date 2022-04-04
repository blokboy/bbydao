import React from "react"

const NurseryStats = () => {
  return (
    <div className="space-y-2 p-3">
      <div className="flex flex-row space-x-2 px-2">
        <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">
          delegates
        </div>
        <button className="rounded-xl border p-1 hover:bg-slate-200 dark:hover:bg-slate-700">
          btn
        </button>
        <button className="rounded-xl border p-1 hover:bg-slate-200 dark:hover:bg-slate-700">
          btn
        </button>
      </div>
      <div className="rounded-xl border p-2">
        <div className="flex flex-col space-y-2">
          <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">
            address / ens
          </div>
          <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">
            dao name
          </div>
        </div>
      </div>
    </div>
  )
}

export default NurseryStats
