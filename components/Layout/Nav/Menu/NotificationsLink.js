import React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import ClickAwayListener from "react-click-away-listener"
import { FiBell } from "react-icons/fi"

import { useUiStore } from "stores/useUiStore"

export default function NotificationsLink() {
  const isOpen = useUiStore(state => state.mobileNotificationsOpen)
  const setOpen = useUiStore(state => state.setMobileNotificationsOpen)

  const openModal = React.useCallback(() => {
    if (!isOpen) {
      setOpen(true)
    }
  }, [isOpen, setOpen])

  return (
    <li className="w-full">
      <button
        className="flex w-full items-center justify-start px-1 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 hover:shadow dark:text-white dark:hover:bg-slate-800"
        onClick={openModal}
      >
        <span className="mr-3 self-center">
          <FiBell />
        </span>
        Notifications
      </button>
    </li>
  )
}
