import React from "react"
import NotificationCard from "./NotificationCard"

const NotificationsDropdown = ({ ...props }) => {
  const { data, notificationCount, notificationsOpen } = props

  return (
    <div
      className={
        (notificationsOpen && notificationCount ? "absolute " : "hidden ") +
        "top-0 right-0 z-50 h-2/3 w-4/12 -translate-x-20 translate-y-20 overflow-auto rounded border bg-slate-200 px-4 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white"
      }
    >
      <div className="mb-2 flex flex-row justify-between rounded border p-2">
        <h1>Notifications</h1>
      </div>
      <ul>
        <li>
        {data?.parsedNotifs.FRIEND_REQUESTS?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
        <li>
        {data?.parsedNotifs.FRIEND_REQUESTS_ACCEPTED?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
        <li>
        {data?.parsedNotifs.PROPOSAL_REQUEST?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
        <li>
        {data?.parsedNotifs.PROPOSAL_RESULT?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
        <li>
        {data?.parsedNotifs.TRANSACTION_EXECUTION?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
        <li>
        {data?.parsedNotifs.DAO_INVITE?.map(notif => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            relationshipRef={notif.ref}
            body={notif.body}
            seen={notif.seen}
            notificationsOpen={notificationsOpen}
          />
        ))}
        </li>
      </ul>
    </div>
  )
}

export default NotificationsDropdown
