import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"

const MessageView = () => {
  return (
    <div className="h-5/6 bg-slate-200 p-2 shadow-xl dark:bg-slate-900 md:w-[75%]">
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
