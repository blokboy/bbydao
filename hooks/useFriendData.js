import React from "react"
import { useQuery } from "react-query"
import { useAccount, useConnect } from "wagmi"

import * as api from "../query"

export default function useFriendStatus(address) {
  const [{ data, error, loading }] = useAccount()
  const [friendStatus, setFriendStatus] = React.useState(null)

  const { data: friendData } = useQuery(
    ["friends", address],
    () => api.getFriends({ initiator: address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const handleFriendStatus = React.useCallback(() => {
    if (!data || !friendData || friendStatus) {
      return
    }

    const match = friendData.find(friend =>
      [friend.initiator, friend.target].includes(data.address)
    )

    if (!match) {
      setFriendStatus({
        isFriend: false,
        isFollowing: false,
        isRequested: false,
      })
      return
    }

    const { status } = match

    setFriendStatus({
      isFriend: status === 1,
      isFollowing: status === 4,
      isRequested: status === 3,
    })
  }, [data, friendData, friendStatus])

  const friendActionText = React.useMemo(() => {
    if (!friendStatus) {
      return
    }

    let text = ""

    if (friendStatus.isRequested) {
      text = "pending"
    } else if (friendStatus.isFriend) {
      text = "frens"
    } else {
      text = "request"
    }

    return text
  }, [friendStatus])

  React.useEffect(() => {
    if (!friendStatus) {
      handleFriendStatus()
    }
  }, [friendStatus, handleFriendStatus])

  return [friendData, { friendStatus, setFriendStatus }, friendActionText]
}
