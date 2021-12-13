import React from "react"
import { useQuery } from "react-query"
import * as api from "../../query"
import { useAccountStore } from "../../stores/useAccountStore"
import { useUiStore } from "../../stores/useUiStore"
import FriendRequest from "./FriendRequest"

// render notifications
const Feed = () => {
  const { id } = useAccountStore.getState().userData
  const setNotificationCount = useUiStore(state => state.setNotificationCount)
  const { data } = useQuery(["notifications", id], () =>
    api.userNotifications({ target: id })
  )

  if (!id) {
    return
  }

  if (data) {
    setNotificationCount(data.notificationCount)
  }

  return (
    <div className="flex flex-col py-2 my-2 w-full">
      {data?.parsedNotifs.FRIEND_REQUESTS.map(notif => (
        <FriendRequest
          key={notif.id}
          id={notif.id}
          relationshipRef={notif.ref}
          body={notif.body}
          seen={notif.seen}
        />
      ))}
    </div>
  )
}

export default Feed
