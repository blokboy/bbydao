import React from "react"
import Link from "next/link"
import { BsPersonCircle } from "react-icons/bs"
import { useAccount } from "wagmi"

const DashboardLink = () => {
  const { data, error, loading, disconnect } = useAccount()

  return (
    <li className="w-full">
      <Link href={data?.address ? `/playground/${data.address}` : "/"}>
        <a className="menu-link justify-start">
          <span className="mr-3 self-center">
            <BsPersonCircle />
          </span>
          Dashboard
        </a>
      </Link>
    </li>
  )
}

export default DashboardLink
