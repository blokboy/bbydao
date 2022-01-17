import React from "react"
import Link from "next/link"
import { BsChatDotsFill } from "react-icons/bs"

const MessagesLink = () => {
  return (
    <li className="w-full">
      <Link href={"/messages"}>
        <a className="flex flex-row rounded hover:shadow text-sm text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-1 py-2 justify-between">
          Messages
          <span className="self-center">
            <BsChatDotsFill />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default MessagesLink
