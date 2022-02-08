import React from "react"
import Link from "next/link"
import { BsPersonCircle } from "react-icons/bs"
import { useAccount } from "wagmi"

const DashboardLink = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <li className="w-full">
      <Link href={data?.address ? `/user/${data.address}` : "/"}>
        <a className="menu-link">
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
