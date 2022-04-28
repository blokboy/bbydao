import React from "react"
import Link from "next/link"
import MessageCard from "./MessageCard"
import { useUiStore } from "stores/useUiStore"
import { HiOutlineArrowCircleRight } from "react-icons/hi"
import { HiOutlineChat } from "react-icons/hi"

const MessagesDropdown = ({ ...props }) => {
  const { messagesOpen, address, threads, clickAway } = props

  const setCreateThreadModalOpen = useUiStore(state => state.setCreateThreadModalOpen)

  const handleStartConversation = () => {
    setCreateThreadModalOpen()
    clickAway()
  }

  return React.useMemo(() => {
    return messagesOpen ? (
      <div className="absolute top-0 right-0 z-50 h-72 w-1/4 h-full -translate-x-44 translate-y-16 mt-3 overflow-auto rounded-xl border bg-slate-200 px-4 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white">
        <div className="mb-2 flex flex-row items-center justify-between border p-2">
          <h1>Messages</h1>
          <div className="flex flex-row">
            <Link href={"/messages"}>
              <a onClick={clickAway}>
                <button className="nav-btn mx-1">
                  <HiOutlineArrowCircleRight />
                </button>
              </a>
            </Link>
            <button className="nav-btn mx-1" onClick={handleStartConversation}>
              <HiOutlineChat />
            </button>
          </div>
        </div>
        <ul className="">
          {threads.map((thread, i) => {
            return <MessageCard key={i} title={thread.title} thread={thread.data} clickAway={clickAway} />
          })}
        </ul>
      </div>
    ) : null
  }, [messagesOpen, clickAway, handleStartConversation, threads])
}

export default MessagesDropdown
