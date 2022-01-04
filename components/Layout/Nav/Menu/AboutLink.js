import React from "react"
import Link from "next/link"
import { HiInformationCircle } from "react-icons/hi"

const AboutLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="flex flex-row rounded hover:shadow text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-2 justify-between">
          About
          <span className="self-center">
            <HiInformationCircle />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default AboutLink
