import React from "react"
import Link from "next/link"
import { BsCollection } from "react-icons/bs"

const FeedLink = () => {
  return (
    <li className="w-full">
      <Link href={"/feed"}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800">
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
