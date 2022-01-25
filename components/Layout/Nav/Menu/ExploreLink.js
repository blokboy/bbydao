import React from "react"
import Link from "next/link"
import { BsGrid } from "react-icons/bs"

const ExploreLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800">
          Explore
          <span className="self-center">
            <BsGrid />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default ExploreLink
