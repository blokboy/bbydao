import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const ListViewCard = () => {
  return (
    <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-900">
      <div className="w-1/12">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <div className="ml-3 flex w-11/12 flex-col pl-3">
        <span className="text-sm font-bold">username / dao name</span>
        <div className="text-sm">Lorem ipsum dolor sit amet.</div>
      </div>
      <div className="self-center	">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default ListViewCard
