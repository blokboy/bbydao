import React from "react"
import Link from "next/link"
import { HiInformationCircle } from "react-icons/hi"

const AboutLink = () => {
  return (
    <li>
      <Link href={"/"}>
        <a className="menu-link flex justify-start">
          <span className="self-center mr-4">
            <HiInformationCircle />
          </span>
          About
        </a>
      </Link>
    </li>
  )
}

export default AboutLink
