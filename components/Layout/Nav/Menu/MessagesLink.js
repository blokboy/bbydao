import React from "react"
import Link from "next/link"
import { BsChatDotsFill } from "react-icons/bs"

const MessagesLink = () => {
  return (
    <li className="w-full">
      <Link href={"/messages"}>
        <a className="flex flex-row rounded hover:shadow text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2 justify-between">
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
