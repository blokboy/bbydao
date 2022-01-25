import React from "react"

const MessageForm = () => {
  return (
    <textarea
      autoFocus
      className="mt-2 h-[10%] w-full resize-none rounded-xl bg-slate-100 p-3 text-white focus:text-slate-900 focus:outline-none dark:bg-slate-800 dark:focus:text-slate-100"
      type="textarea"
      placeholder="Message..."
      autoComplete="off"
    />
  )
}

export default MessageForm
