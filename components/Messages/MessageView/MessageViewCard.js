import React from "react"

// img circle icon on the left
// username on top of message

const MessageViewCard = () => {
  return (
    <li className="flex flex-row mb-2 rounded-lg bg-gray-200 dark:bg-gray-900 w-full p-3">
      <div className="w-1/12">
        <div className="rounded-full border border-white bg-gray-200 dark:bg-gray-900 h-10 w-10"></div>
      </div>
      <div className="flex flex-col w-11/12 pl-3">
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
