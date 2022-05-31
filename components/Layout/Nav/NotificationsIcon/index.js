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

  const { data } = useQuery(["notifications"], () => api.userNotifications({ target: address }), { staleTime: 180000, refetchOnWindowFocus: false, })

  const handleNotificationData = React.useCallback(() => {
    if (!data) {
      return
    }

    setNotificationCount(data?.notificationCount)
  }, [data])

  const clickAway = React.useCallback(() => {
    if (!notificationsOpen) return
    setNotificationsOpen(false)
  }, [notificationsOpen])

  const openNotifications = React.useCallback(() => {
    if (!notificationsOpen) {
      setNotificationsOpen(true)
    }
  }, [notificationsOpen])

  React.useEffect(handleNotificationData, [handleNotificationData])

  if (!address) return <></>

  const notifNumberDisplay = React.useMemo(() => {
    return notificationCount ? (
      <span
        className={
          "absolute -mt-8 -mr-8 rounded-full bg-red-500 py-1 text-xs text-white" +
          (notificationCount > 10 ? " px-1" : " px-2")
        }
      >
        {notificationCount}
      </span>
    ) : null
  }, [notificationCount])

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="hidden flex-row items-center justify-center md:flex">
        <button className="nav-btn" onClick={openNotifications}>
          <FiBell />
        </button>
        {notifNumberDisplay}

        {/* <NotificationsDropdown
          data={data}
          notificationsOpen={notificationsOpen}
          notificationCount={notificationCount}
        /> */}
      </div>
    </ClickAwayListener>
  )
}

export default NotificationsIcon
