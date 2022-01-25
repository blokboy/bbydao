import React from "react"
import Link from "next/link"
import { BsPersonCircle } from "react-icons/bs"
import { useAccount } from "wagmi"

const DashboardLink = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <li className="w-full">
      <Link href={data?.address ? `/user/${data.address}` : "/"}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800">
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
