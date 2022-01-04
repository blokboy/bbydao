import React from "react"

const MessageForm = () => {
  return (
    <input
      autoFocus
      className="w-full h-[10%] mt-3 px-3 rounded-xl text-sm text-white bg-gray-200 focus:outline-none focus:text-gray-900 dark:bg-gray-800 dark:focus:text-gray-100"
      type="textarea"
      placeholder="Message..."
      autoComplete="off"
    />
  )
}

export default MessageForm
