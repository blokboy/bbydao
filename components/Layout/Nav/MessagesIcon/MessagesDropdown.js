import React from "react"
import MessageCard from "./MessageCard"

const MessagesDropdown = ({ ...props }) => {
  const { messagesOpen } = props

  return (
    <div
      className={
        (messagesOpen ? "absolute " : "hidden ") +
        "top-0 right-0 -translate-x-20 translate-y-20 z-50 rounded border shadow px-4 py-2 text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-900 h-2/3 w-4/12"
      }
    >
      <div className="flex flex-row rounded border justify-between p-2 mb-2">
        <h1>Messages</h1>
      </div>
      <ul>
        <MessageCard />
      </ul>
    </div>
  )
}

export default MessagesDropdown
