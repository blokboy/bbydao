import React from "react"

// img circle icon on the left
// username on top of message

const MessageViewCard = () => {
  return (
    <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-900">
      <div className="w-1/12">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <div className="flex w-11/12 flex-col pl-3">
        <span className="font-bold">username</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          dolores vero facere dicta neque rerum laboriosam laudantium
          dignissimos similique sequi.
        </div>
      </div>
    </li>
  )
}

export default MessageViewCard
