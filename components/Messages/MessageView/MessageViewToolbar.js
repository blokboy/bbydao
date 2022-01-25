import React from "react"
import { BsChatDotsFill } from "react-icons/bs"

const MessageViewToolbar = () => {
  return (
    <div className="mb-2 flex h-[5%] w-full">
      <button className="flex flex-row rounded-xl bg-slate-50 py-1 px-3 text-sm shadow dark:bg-slate-800">
        <span className="h-full pr-1 pt-1 text-slate-800 dark:text-white">
          <BsChatDotsFill />
        </span>
        messages
      </button>
    </div>
  )
}

export default MessageViewToolbar
