import React from "react"
import Link from "next/link"
import { HiInformationCircle } from "react-icons/hi"

const AboutLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="flex flex-row rounded hover:shadow-sm text-sm text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-1 py-2 justify-between">
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
