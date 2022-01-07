import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"
import MessageViewToolbar from "./MessageViewToolbar"

const MessageView = () => {
  return (
    <div className="shadow-xl md:w-[75%] h-5/6 bg-gray-200 dark:bg-gray-900 p-2">
      <MessageViewToolbar />
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
