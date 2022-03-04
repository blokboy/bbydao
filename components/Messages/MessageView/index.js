import React from "react"
import MessageToolbar from "./MessageToolbar"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"

const MessageView = () => {
  return (
    <div className="w-full md:w-2/3">
      <MessageToolbar />
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
