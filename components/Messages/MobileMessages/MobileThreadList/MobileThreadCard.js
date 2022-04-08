import React from "react"
import { useMessageStore } from "stores/useMessageStore"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const MobileThreadCard = ({ title, thread }) => {
  const { setThreadChannel } = useMessageStore()
  const threadChannel = useMessageStore(state => state.threadChannel)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  const handleClickCard = () => {
    setThreadChannel(thread.channel)
    setMobileThreadView()
  }

  return (
    <li
      className={
        "mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-800" +
        (threadChannel === thread.channel ? " text-[#FC8D4D]" : "")
      }
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

export default MobileThreadCard
