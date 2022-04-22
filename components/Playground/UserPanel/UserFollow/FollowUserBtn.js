import React from "react"
import { BiUserPlus } from "react-icons/bi"

const FollowUserBtn = () => {
  return (
    <button className="flex flex-row items-center justify-center space-x-3 bg-slate-200 hover:border-teal-300 dark:bg-slate-800 dark:hover:bg-slate-700 border dark:border-slate-800 dark:hover:border-teal-300 rounded-lg p-1 w-28">
      <BiUserPlus size={18} />
      <span>follow</span>
    </button>
  )
}

export default FollowUserBtn
