import React from "react"
import Link from "next/link"
import { HiOutlineArrowCircleRight } from "react-icons/hi"

const UserInboxCard = ({ address }) => {
  return (
    <Link href={`/messages/${address}`}>
      <a>
        <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-800">
          <div className="ml-3 flex w-11/12 flex-col pl-3">
            <span className="text-sm font-bold">
              {/* {address?.length > 30
                ? address.substring(0, 10).concat("...")
                : address} */}
              Main Channel
            </span>
          </div>
          <div className="self-center">
            <HiOutlineArrowCircleRight size={24} />
          </div>
        </li>
      </a>
    </Link>
  )
}

export default UserInboxCard
