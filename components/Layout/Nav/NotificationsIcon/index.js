import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useQuery } from "react-query"
import * as api from "query"
// import { useAccountStore } from "stores/useAccountStore"
import { useUiStore } from "stores/useUiStore"
import { FiBell } from "react-icons/fi"
import NotificationsDropdown from "./NotificationsDropdown"

const NotificationsIcon = ({ id }) => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const notificationCount = useUiStore(state => state.notificationCount)
  const setNotificationCount = useUiStore(state => state.setNotificationCount)

  const { data } = useQuery(
    ["notifications"],
    () => api.userNotifications({ target: id })
    // { onSettled: data => console.log("settled data", data) }
  )

  React.useEffect(() => {
    if (!data) return
    setNotificationCount(data?.notificationCount)
  }, [data]) /* eslint-disable-line react-hooks/exhaustive-deps */

  const clickAway = event => {
    if (!notificationsOpen) return
    // if (event.target.id === "notification-menu") return
    // console.log(event)

    setNotificationsOpen(false)
  }

  if (!id) return <></>

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="mr-3 hidden flex-row items-center justify-center md:flex">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-slate-800 shadow hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
        >
          <FiBell />
        </button>
        {notificationCount ? (
          <span
            className={
              "absolute -mt-8 -mr-8 rounded-full bg-red-500 py-1 text-xs text-white" +
              (notificationCount > 10 ? " px-1" : " px-2")
            }
          >
            {notificationCount}
          </span>
        ) : (
          <></>
        )}

        <NotificationsDropdown
          data={data}
          notificationsOpen={notificationsOpen}
          notificationCount={notificationCount}
        />
      </div>
    </ClickAwayListener>
  )
}

export default NotificationsIcon
