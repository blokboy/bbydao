import React from "react"
import Link from "next/link"
import { BsCollection } from "react-icons/bs"

const FeedLink = () => {
  return (
    <li className="w-full">
      <Link href={"/feed"}>
        <a className="flex flex-row rounded hover:shadow text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2 justify-between">
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
