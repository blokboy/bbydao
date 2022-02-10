import React from "react"
import Link from "next/link"
import { BsChatDotsFill } from "react-icons/bs"
import { useAccount } from "wagmi"

const MessagesLink = () => {
  const [{ data, error, loading }, disconnect] = useAccount()
  
  return (
    <li className="w-full">
      <Link href={`/messages/${data?.address}`}>
        <a className="flex flex-row justify-between rounded px-1 py-2 text-sm text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800">
          Messages
          <span className="self-center">
            <BsChatDotsFill />
          </span>
        </a>
      </Link>
    </li>
  )
}

export default MessagesLink
