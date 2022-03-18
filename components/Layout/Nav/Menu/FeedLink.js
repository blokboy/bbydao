import React from "react"
import Link from "next/link"
import { BsCollection } from "react-icons/bs"

const FeedLink = () => {
  return (
    <li className="w-full">
      <Link href={"/feed"}>
        <a className="menu-link justify-start">
          <span className="mr-3 self-center">
            <BsCollection />
          </span>
          Explore
        </a>
      </Link>
    </li>
  )
}

export default FeedLink
