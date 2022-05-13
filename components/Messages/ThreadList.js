import React from "react"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"
import { isMobile } from "react-device-detect"

import DesktopThreadCard from "./DesktopMessages/DesktopThreadList/DesktopThreadCard"
import MobileThreadCard from "./MobileMessages/MobileThreadList/MobileThreadCard"

export default function ThreadList() {
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const { channelAddress } = useMessageStore()
  const { data, error, loading, disconnect } = useAccount()

  React.useEffect(() => {
    if (!data?.address || channelAddress) return
    setChannelAddress(data?.address)
  }, [loading])

  const { data: channelThreads } = useQuery(
    ["threads", channelAddress],
    () => api.getUserThreads({ address: channelAddress }),
    {
      staleTime: 180000,
      enabled: !!channelAddress,
      // retry: false,
      // retryOnMount: false,
      // refetchOnWindowFocus: false,
      // staleTime: Infinity,
    }
  )

  const messages = React.useMemo(() => {
    return channelThreads
      ? Object.entries(channelThreads).map(([key, value]) => ({
          title: key,
          data: value,
        }))
      : []
  }, [channelThreads])

  const cards = React.useMemo(() => {
    if (!messages.length) {
      return null
    }

    return messages.map((thread, i) => {
      return isMobile ? (
        <MobileThreadCard key={i} title={thread.title} thread={thread.data} />
      ) : (
        <DesktopThreadCard key={i} title={thread.title} thread={thread.data} />
      )
    })
  }, [messages, isMobile])

  return <div className="p-3">{cards}</div>
}
