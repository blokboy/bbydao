import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"
import MessageViewToolbar from "./MessageViewToolbar"

const MessageView = () => {
  return (
    <div className="shadow-xl w-full h-5/6 md:w-3/6 md:rounded-xl bg-gray-200 dark:bg-gray-900 p-2">
      <MessageViewToolbar />
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
