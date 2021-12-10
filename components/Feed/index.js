import React from "react"
import { useQuery } from "react-query"
import { useAccountStore } from "../../stores/useAccountStore"
import { useUiStore } from "../../stores/useUiStore"
import * as api from "../../query"
import FriendRequest from "./FriendRequest"

// render notifications
const Feed = () => {
  const { id } = useAccountStore.getState().userData
  const setNotificationCount = useUiStore(state => state.setNotificationCount)
  const { data } = useQuery(["notifications", id], () =>
    api.userNotifications({ target: id })
  )

  if (data) {
    setNotificationCount(data.notificationCount)
  }

  return (
    <div className="flex flex-col py-2 my-2 w-full">
      {data?.parsedNotifs.FRIEND_REQUESTS.map(notif => (
        <FriendRequest key={notif.id} id={notif.id} body={notif.body} />
      ))}
    </div>
  )
}

export default Feed
