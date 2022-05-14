import React from "react"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"
import DesktopThreadCard from "./DesktopThreadCard"

const DesktopThreadList = () => {
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

  return (
    <div className="p-3">
      {messages.map((thread, i) => {
        return (
          <DesktopThreadCard
            key={i}
            title={thread.title}
            thread={thread.data}
          />
        )
      })}
    </div>
  )
}

export default DesktopThreadList
