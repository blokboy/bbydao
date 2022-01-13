import React from "react"
import Head from "next/head"
import { useQuery } from "react-query"
import * as api from "query"
import { useAccountStore } from "stores/useAccountStore"
import { useUiStore } from "stores/useUiStore"
import FriendRequest from "./FriendRequest"

const Feed = () => {
  const userData = useAccountStore(state => state.userData)
  const setNotificationCount = useUiStore(state => state.setNotificationCount)

  //error on disconnect
  const { data } = useQuery(["notifications"], () =>
    api.userNotifications({ target: userData.id })
  )

  if (!userData) {
    return <></>
  }

  if (data) {
    setNotificationCount(data?.notificationCount)
  }

  return (
    <>
      <Head>
        <title>{"babydao | feed"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    </>
  )
}

export default Feed
