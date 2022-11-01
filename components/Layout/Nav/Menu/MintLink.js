import React from "react"
import Link from "next/link"
import { BiCubeAlt } from "react-icons/bi"

const MintLink = () => {
  return (
    <li>
      <Link legacyBehavior href={"/mint"}>
        <a className="menu-link flex justify-start">
          <span className="self-center mr-4">
            <BiCubeAlt />
          </span>
          Mint
        </a>
      </Link>
    </li>
  )
}

export default MintLink
