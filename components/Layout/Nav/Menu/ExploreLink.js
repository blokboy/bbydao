import React from "react"
import Link from "next/link"
import { BsGrid } from "react-icons/bs"

const ExploreLink = () => {
  return (
    <li>
      <Link legacyBehavior href={"/"}>
        <a className="menu-link flex justify-start">
          <span className="self-center mr-4">
            <BsGrid />
          </span>
          Explore
        </a>
      </Link>
    </li>
  )
}

export default ExploreLink
