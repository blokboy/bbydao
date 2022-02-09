import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const MessageCard = ({ title, thread }) => {
  return (
    <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-100 p-3 dark:bg-slate-800 cursor-pointer">
      <div className="flex w-full flex-col pl-3">
        <span className="font-bold">{ title?.length > 20? title.substring(0, 10).concat("...") : title }</span>
      </div>
      <div className="self-center	">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default MessageCard
