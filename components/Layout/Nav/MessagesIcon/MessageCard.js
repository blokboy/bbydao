import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const MessageCard = () => {
  return (
    <li className="flex flex-row mb-2 rounded-lg bg-slate-100 dark:bg-slate-800 w-full p-3">
      <div className="flex flex-col w-full pl-3">
        <span className="font-bold">username / dao name</span>
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
      <div className="self-center	">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default MessageCard
