import React from "react"
import Image from "next/image"
import { IoMdAddCircleOutline } from "react-icons/io"
import { HiExternalLink } from "react-icons/hi"

const DaoPfpIcon = ({ isMember }) => {
  // follow button if not following
  // uniswap button if user is an owner of the dao

  // maybe instead this could serve as an emoji status indicator, or a link to dao page

  return (
    <div className="absolute space-y-1">
      <button className="flex h-8 w-8 items-center justify-center rounded-full border text-white border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700">
        {isMember ? (
          <Image src="/icons/uniswap-uni-logo.svg" alt="add" width={18} height={18} />
        ) : (
          // <IoMdAddCircleOutline />
          <HiExternalLink />
          // <div className="text-xs p-1">💙</div>
        )}
      </button>
    </div>
  )
}

export default DaoPfpIcon
