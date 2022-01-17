import React from "react"
import NotificationCard from "./NotificationCard"

const NotificationsDropdown = ({ ...props }) => {
  const { data, notificationCount, notificationsOpen } = props

  return (
    <div
      className={
        (notificationsOpen && notificationCount ? "absolute " : "hidden ") +
        "overflow-auto top-0 right-0 -translate-x-20 translate-y-20 z-50 rounded border shadow px-4 py-2 text-slate-800 bg-slate-200 dark:text-white dark:bg-slate-900 h-2/3 w-4/12"
      }
    >
      <div className="flex flex-row rounded border justify-between p-2 mb-2">
        <h1>Notifications</h1>
      </div>
      <ul>
        {data?.parsedNotifs.FRIEND_REQUESTS.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
      </ul>
    </div>
  )
}

export default NotificationsDropdown
