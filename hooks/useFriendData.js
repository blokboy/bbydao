import React from "react"
import { useQuery } from "react-query"
import { useAccount, useConnect } from "wagmi"

import * as api from "../query"

export default function useFriendData(address) {
  const [{ data, error, loading }] = useAccount()

  const { data: friendData, refetch } = useQuery(
    ["friends", address],
    () => api.getFriends({ initiator: address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const friendStatus = React.useMemo(() => {
    const initFriendStatus = {
      data: null,
      isSet: false,
      isFriend: false,
      isFollowing: false,
      isRequested: false,
    }

    if (!data || !friendData) {
      return { ...initFriendStatus }
    }

    const match = friendData.find(friend =>
      [friend.initiator, friend.target].includes(data.address)
    )

    if (!match) {
      return {
        ...initFriendStatus,
        isSet: true,
      }
    }

    const { status } = match

    return {
      data: { ...match },
      isSet: true,
      isFriend: status === 1,
      isFollowing: status === 4,
      isRequested: status === 3,
    }
  }, [data, friendData])

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

  return [
    friendData,
    {
      friendStatus,
      refetch: () => refetch({ throwOnError: false, cancelRefetch: false }),
    },
    friendActionText,
  ]
}
