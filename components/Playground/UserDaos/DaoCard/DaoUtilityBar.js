import React from "react"
import { HiStar } from "react-icons/hi"
import { RiUserFollowLine } from "react-icons/ri"
import CreateNurseryBtn from "./CreateNurseryBtn"

const DaoUtilityBar = ({ isMember }) => {
  // currently rendering these in an activated state
  // fill should be neautral, then colorful when following or favorited
  return (
    <div className="flex h-0 w-full flex-row items-end justify-end space-x-1">
      {isMember ? (
        <CreateNurseryBtn />
      ) : (
        <React.Fragment>
          <button className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-blue-700 shadow hover:bg-slate-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-600">
            <RiUserFollowLine />
          </button>
          <button className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-orange-300 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
            <HiStar />
          </button>
        </React.Fragment>
      )}
    </div>
  )
}

export default DaoUtilityBar
