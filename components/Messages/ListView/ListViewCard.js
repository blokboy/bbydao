import axios from "axios"
import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"
import { useMessageStore } from "stores/useMessageStore"

const ListViewCard = ({ title, thread }) => {
  const { setThreadChannel } = useMessageStore()

  const handleClickCard = () => {
    setThreadChannel(thread.channel)
  }

  return (
    <li
      className="mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-800"
      onClick={handleClickCard}
    >
      <div className="ml-3 flex w-11/12 flex-col pl-3">
        <span className="text-sm font-bold">
          {" "}
          {title?.length > 30 ? title.substring(0, 10).concat("...") : title}
        </span>
      </div>
      <div className="self-center">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default ListViewCard
