import React from "react"
import Link from "next/link"
import { BsChatDotsFill } from "react-icons/bs"

const MessagesLink = () => {
  return (
    <li className="w-full">
      <Link href={"/messages"}>
        <a className="menu-link">
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
