import React from "react"
import Link from "next/link"
import { walletSnippet } from "utils/helpers"

const FollowerModal = ({ followers }) => {
  return (
    <div>
      <div className="flex flex-col py-4">
        {!!followers &&
          followers?.map(f => (
            <Link href={`/playground/${f.initiator}`} key={f.id}>
              <div className="mb-2 rounded-lg bg-slate-300 p-4 hover:cursor-pointer hover:bg-slate-400 hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700">
                {f.initiatorEns || walletSnippet(f.initiator)}
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default FollowerModal
