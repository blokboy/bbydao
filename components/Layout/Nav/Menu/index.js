import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { HiDotsHorizontal } from "react-icons/hi"
import { useConnect } from "wagmi"

import DashboardLink from "./DashboardLink"
import MenuThemeToggle from "./MenuThemeToggle"
import MessagesLink from "./MessagesLink"
import ExploreLink from "./ExploreLink"
import FeedLink from "./FeedLink"
import AboutLink from "./AboutLink"
import NotificationsLink from "./NotificationsLink"
import useNotifications from "../../../../hooks/useNotifications"

const Menu = ({ address }) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [{ data }, connect] = useConnect()
  const notifications = useNotifications(address)

  const clickAway = React.useCallback(() => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }, [menuOpen])

  const openMenu = React.useCallback(() => {
    if (!menuOpen) {
      setMenuOpen(true)
    }
  }, [menuOpen])

  const notificationIndicator = React.useMemo(() => {
    return notifications.length ? (
      <div className="animate absolute top-[7px] right-[10px] z-10 h-4 w-4 rounded-full border bg-red-600 shadow" />
    ) : null
  }, [notifications])

  const dropdown = React.useMemo(() => {
    return menuOpen ? (
      <div className="absolute top-0 right-0 z-50 h-auto w-1/2 origin-top-right translate-y-20 -translate-x-4 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white md:-mt-2 md:w-48 md:-translate-x-16">
        <ul className="py-1" onClick={clickAway}>
          {data.connected ? (
            <>
              <DashboardLink />
              <MessagesLink />
              <NotificationsLink notifications={notifications} />
              <FeedLink />
            </>
          ) : (
            <ExploreLink />
          )}
          <AboutLink />
          <MenuThemeToggle />
        </ul>
      </div>
    ) : null
  }, [menuOpen, clickAway, data.connected])

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div>
        <button
          onClick={openMenu}
          className="relative z-10 h-10 rounded-xl border border-slate-400 bg-slate-200 px-3 py-2 text-xl text-slate-800 shadow hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
        >
          <HiDotsHorizontal />
        </button>
        {notificationIndicator}
        {dropdown}
      </div>
    </ClickAwayListener>
  )
}

export default Menu
