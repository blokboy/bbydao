import React from "react"
import Link from "next/link"
import { BsChatDotsFill } from "react-icons/bs"

const MessagesLink = () => {
  return (
    <li className="w-full">
      <Link href={"/messages"}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800">
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
