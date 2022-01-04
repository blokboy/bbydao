import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"

const MessageView = () => {
  return (
    <div className="shadow-xl w-full h-5/6 md:w-3/6 md:rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900">
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
