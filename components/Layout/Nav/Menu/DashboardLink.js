import React from "react"
import Link from "next/link"
import { BsPersonCircle } from "react-icons/bs"

const DashboardLink = ({ data }) => {
  return (
    <li className="w-full">
      <Link href={data ? `/user/${data.address}` : "/"}>
        <a className="flex flex-row rounded hover:shadow text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2 justify-between">
          Dashboard
          <span className="self-center">
            <BsPersonCircle />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default DashboardLink
