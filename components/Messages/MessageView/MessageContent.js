import React from "react"
import MessageViewCard from "./MessageViewCard"

// iterate over messages to cards

const MessageContent = () => {
  return (
    <div className="overflow-auto rounded-xl bg-gray-50 dark:bg-gray-800 h-[90%] p-3">
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
      <MessageViewCard />
    </div>
  )
}

export default MessageContent
