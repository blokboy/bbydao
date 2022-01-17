import React from "react"
import MessageViewCard from "./MessageViewCard"

// iterate over messages to cards

const MessageContent = () => {
  return (
    <div className="overflow-auto rounded-xl bg-slate-50 dark:bg-slate-800 h-[82%] p-3">
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
    </div>
  )
}

export default MessageContent
