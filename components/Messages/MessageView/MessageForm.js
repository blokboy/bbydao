import React from "react"

const MessageForm = () => {
  return (
    <textarea
      autoFocus
      className="resize-none w-full h-[10%] mt-2 p-3 rounded-xl text-white bg-slate-100 focus:outline-none focus:text-slate-900 dark:bg-slate-800 dark:focus:text-slate-100"
      type="textarea"
      placeholder="Message..."
      autoComplete="off"
    />
  )
}

export default MessageForm
