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
    ["notifications", id],
    () => api.userNotifications({ target: id })
    // { onSettled: data => console.log("settled data", data) }
  )

  React.useEffect(() => {
    if (!data) return
    setNotificationCount(data.data?.notificationCount)
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
