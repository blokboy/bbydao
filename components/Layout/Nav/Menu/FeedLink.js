import React from "react"
import Link from "next/link"
import { BsCollection } from "react-icons/bs"

const FeedLink = () => {
  return (
    <li className="w-full">
      <Link href={"/feed"}>
        <a className="menu-link">
          Feed
          <span className="self-center">
            <BsCollection />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default FeedLink
