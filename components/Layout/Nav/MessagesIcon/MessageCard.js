import React from "react"
import Link from "next/link"
import { HiOutlineArrowCircleRight } from "react-icons/hi"
import { useMessageStore } from "stores/useMessageStore"

const MessageCard = ({ title, thread, clickAway }) => {
  const { setThreadChannel } = useMessageStore()

  const handleClickCard = () => {
    setThreadChannel(thread.channel)
    clickAway()
  }

  return (
    <Link
      href={`/messages/${thread.address}`}
      as={`/messages/${thread.address}`}
    >
      <a>
        <li
          className="mb-2 flex w-full cursor-pointer flex-row rounded-lg bg-slate-100 p-3 dark:bg-slate-800"
          onClick={handleClickCard}
        >
          <div className="flex w-full flex-col pl-3">
            <span className="font-bold">
              {title?.length > 20
                ? title.substring(0, 10).concat("...")
                : title}
            </span>
          </div>
          <div className="self-center	">
            <HiOutlineArrowCircleRight size={24} />
          </div>
        </li>
      </a>
    </Link>
  )
}

export default MessageCard
