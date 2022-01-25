import React from "react"
import MessageViewCard from "./MessageViewCard"

// iterate over messages to cards

const MessageContent = () => {
  return (
    <div className="h-[82%] overflow-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
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
