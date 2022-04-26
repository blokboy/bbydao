import React from "react"
import { HiPencilAlt } from "react-icons/hi"

const DaoName = ({ safe, isMember }) => {
  return (
    <div className="flex flex-row items-center space-x-3">
      <div className="text-2xl">{safe?.substring(0, 6) + "..." + safe.substring(safe.length - 4)}</div>
      {isMember ? (
        <button className="flex flex-col items-center justify-center w-full text-center text-sm border hover:text-teal-300 hover:border-white dark:hover:border-white border-slate-100 dark:border-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg p-1">
          <HiPencilAlt size={18} />
        </button>
      ) : null}
    </div>
  )
}

export default DaoName
