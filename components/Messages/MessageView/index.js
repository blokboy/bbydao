import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"

const MessageView = () => {
  return (
    <div className="md:w-50 h-full w-full bg-slate-100 p-2 shadow-xl dark:bg-slate-900">
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
