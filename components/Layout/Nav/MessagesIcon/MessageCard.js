import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const MessageCard = () => {
  return (
    <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
      <div className="flex w-full flex-col pl-3">
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
