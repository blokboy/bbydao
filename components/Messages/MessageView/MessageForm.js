import React from "react"

const MessageForm = () => {
  return (
    <textarea
      autoFocus
      className="resize-none w-full h-[10%] mt-2 p-3 rounded-xl text-white bg-gray-100 focus:outline-none focus:text-gray-900 dark:bg-gray-800 dark:focus:text-gray-100"
      type="textarea"
      placeholder="Message..."
      autoComplete="off"
    />
  )
}

export default MessageForm
