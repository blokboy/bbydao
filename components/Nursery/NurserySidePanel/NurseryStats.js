import React from "react"
import { HiOutlineUsers } from "react-icons/hi"
import { BsGear } from "react-icons/bs"

const NurseryStats = () => {
  return (
    <div className="space-y-2 p-3">
      <div className="flex flex-row space-x-2 px-2">
        <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">
          delegates
        </div>
        <button className="icon-util-btn">
          <HiOutlineUsers size={18} />
        </button>
        <button className="icon-util-btn">
          <BsGear size={18} />
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
