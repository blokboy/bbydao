import React from "react"
import Link from "next/link"
import { HiInformationCircle } from "react-icons/hi"

const AboutLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow-sm dark:text-white dark:hover:bg-slate-800">
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
