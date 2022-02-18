import React from "react"
import Link from "next/link"
import { HiOutlineChat, HiExternalLink } from "react-icons/hi"
import { useAccount } from "wagmi"

const FriendSearchCard = ({ friend, closeModal }) => {
  const [{ data, error, loading }] = useAccount()
  console.log('friend ', friend)

  return (
    <div className="flex mb-1 h-16 flex-row rounded bg-slate-300 px-3 shadow dark:bg-slate-800">
      <div className="flex h-full w-full flex-row items-center justify-between">
        <span className="text-lg font-semibold">
          @
          {friend.initiator === data?.address 
            ? friend.targetEns || friend.target.substring(0, 12).concat("...")
            : friend.initiatorEns || `${friend.initiator.substring(0, 12) + "..."}`}
        </span>
        <div className="flex flex-row">
          {data?.address === friend.target || data?.address === friend.initiator ? (
            <button className="friend-result-btn" onClick={closeModal}>
              <HiOutlineChat />
            </button>
          ) : (
            <></>
          )}
          <Link href={`/user/${encodeURIComponent(friend.initiator === data?.address ? friend.target : friend.initiator)}`}>
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
