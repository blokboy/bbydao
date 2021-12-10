import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useQuery } from "react-query"
import * as api from "../../../query"
import { useAccountStore } from "../../../stores/useAccountStore"
import { useUiStore } from "../../../stores/useUiStore"
import { FiBell } from "react-icons/fi"
import NotificationCard from "./NotificationCard"

const NotificationsIcon = () => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const notificationCount = useUiStore(state => state.notificationCount)
  const setNotificationCount = useUiStore(state => state.setNotificationCount)
  const { id } = useAccountStore.getState().userData
  const { data } = useQuery(["notifications", id], () =>
    api.userNotifications({ target: id })
  )

  if (data) {
    setNotificationCount(data.notificationCount)
  }

  const clickAway = () => {
    if (!notificationsOpen) {
      return
    }
    setNotificationsOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="hidden md:flex flex-row items-center justify-center mr-3">
        <button
          className="flex rounded-full border border-gray-400 shadow bg-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 p-1 h-10 w-10 justify-center items-center text-gray-800 dark:text-white"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
        >
          <FiBell />
        </button>
        {notificationCount ? (
          <span
            className={
              "absolute -mt-8 -mr-8 bg-red-500 text-white text-xs rounded-full py-1" +
              (notificationCount > 10 ? " px-1" : " px-2")
            }
          >
            {notificationCount}
          </span>
        ) : (
          <></>
        )}
        <div
          className={
            (notificationsOpen ? "absolute " : "hidden ") +
            "z-50 rounded border shadow -ml-96 mt-32 px-4 py-2 text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-900 w-4/12"
          }
        >
          <ul className="py-1" onClick={clickAway}>
            {/*  */}
            {data?.parsedNotifs.FRIEND_REQUESTS.map(notif => (
              <NotificationCard
                key={notif.id}
                id={notif.id}
                relationshipRef={notif.ref}
                body={notif.body}
              />
            ))}
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default NotificationsIcon
