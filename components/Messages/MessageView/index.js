import React from "react"
import MessageContent from "./MessageContent"
import MessageForm from "./MessageForm"

const MessageView = () => {
  return (
    <div className="w-full">
      <MessageContent />
      <MessageForm />
    </div>
  )
}

export default MessageView
