import React from "react"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"
import MobileThreadCard from "./MobileThreadCard"

const MobileThreadList = () => {
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const { channelAddress } = useMessageStore()
  const [{ data, error, loading }, disconnect] = useAccount()

  React.useEffect(() => {
    if (!data?.address) return
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

  const messages = []
  if (channelThreads) {
    for (const [key, values] of Object.entries(channelThreads)) {
      messages.push([key, values])
    }
  }

  return (
    <div className="h-screen p-3">
      {messages.map((thread, i) => {
        return <MobileThreadCard key={i} title={thread[0]} thread={thread[1]} />
      })}
    </div>
  )
}

export default MobileThreadList
