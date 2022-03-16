import React from "react"
import { HiOutlineInbox, HiOutlineChat, HiPlus } from "react-icons/hi"

const FooterNavigation = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 h-20 dark:bg-slate-800">
      <div className="grid h-full w-full grid-cols-3 gap-1">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <HiOutlineInbox size={36} />
          <span>Inboxes</span>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <HiOutlineChat size={36} />
          <span>Messages</span>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <HiPlus size={36} />
          <span>Create</span>
        </div>
      </div>
    </nav>
  )
}

export default FooterNavigation
