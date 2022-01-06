import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const ListViewCard = () => {
  return (
    <li className="flex flex-row mb-2 rounded-lg bg-gray-200 dark:bg-gray-900 w-full p-3">
      <div className="w-1/12">
        <div className="rounded-full border border-white bg-gray-200 dark:bg-gray-900 h-10 w-10"></div>
      </div>
      <div className="flex flex-col w-11/12 pl-3">
        <span className="font-bold">username / dao name</span>
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
      <div className="self-center	">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default ListViewCard
