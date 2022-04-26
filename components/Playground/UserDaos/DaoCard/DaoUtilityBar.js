import React from 'react'
import { HiStar } from 'react-icons/hi'
import { RiUserFollowLine } from 'react-icons/ri'

const DaoUtilityBar = () => {
  // currently rendering these in an activated state
  // fill should be neautral, then colorful when following or favorited
  return (
    <div className="w-full h-0 flex flex-row space-x-1 items-end justify-end">
      <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-blue-700 dark:text-blue-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
        <RiUserFollowLine />
      </button>
      <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-orange-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
        <HiStar />
      </button>
    </div>
  )
}

export default DaoUtilityBar