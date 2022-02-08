import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useQuery } from "react-query"
import * as api from "query"
import { useUiStore } from "stores/useUiStore"
import { FiBell } from "react-icons/fi"
import NotificationsDropdown from "./NotificationsDropdown"

const NotificationsIcon = ({ address }) => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const notificationCount = useUiStore(state => state.notificationCount)
  const setNotificationCount = useUiStore(state => state.setNotificationCount)

  const { data } = useQuery(
    ["notifications"],
    () => api.userNotifications({ target: address }),
    { staleTime: 180000 }
  )

  React.useEffect(() => {
    if (!data) return
    setNotificationCount(data?.notificationCount)
  }, [data]) /* eslint-disable-line react-hooks/exhaustive-deps */

  const clickAway = event => {
    if (!notificationsOpen) return
    setNotificationsOpen(false)
  }

  if (!address) return <></>

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="mr-3 hidden flex-row items-center justify-center md:flex">
        <button
          className="nav-btn"
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
