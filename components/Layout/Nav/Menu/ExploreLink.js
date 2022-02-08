import React from "react"
import Link from "next/link"
import { BsGrid } from "react-icons/bs"

const ExploreLink = () => {
  return (
    <li className="w-full">
      <Link href={"/"}>
        <a className="menu-link">
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
