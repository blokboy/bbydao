import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const NurseryCard = () => {
  return (
    <li className="mb-2 flex w-full flex-row justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-900">
      <div className="flex flex-row items-center">
        <div className="mx-2 h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
        <span className="">nursery</span>
      </div>
      <div className="flex flex-row items-center">
        <div className="mx-2 h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
        <div className="self-center">
          <HiOutlineArrowCircleRight size={24} />
        </div>
      </div>
    </li>
  )
}

export default NurseryCard
