import React from "react"
import Link from "next/link"
import { HiOutlineChat, HiExternalLink } from "react-icons/hi"

const FriendSearchCard = ({ friend, closeModal }) => {
  return (
    <div className="flex h-16 flex-row rounded bg-slate-300 px-3 shadow dark:bg-slate-800">
      <div className="flex h-full w-full flex-row items-center justify-between">
        <span className="text-lg font-semibold">
          @
          {friend.initiatorEns
            ? friend.initiatorEns
            : `${friend.initiator.substring(0, 12) + "..."}`
          }
        </span>
        <div className="flex flex-row">
          <button className="friend-result-btn">
            <HiOutlineChat />
          </button>
          <Link href={`/user/${encodeURIComponent(friend.initiator)}`}>
            <a onClick={closeModal}>
              <button className="friend-result-btn">
                <HiExternalLink />
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendSearchCard
