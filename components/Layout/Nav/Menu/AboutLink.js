import React from "react"
import Link from "next/link"
import { HiInformationCircle } from "react-icons/hi"

const AboutLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="menu-link">
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
