import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"

const ListView = ({ threads }) => {
  // get user or dao threads (address)
  // will need to put address into state, once that value is there, fetch threads
  const { channelAddress } = useMessageStore()

  const { data: channelThreads } = useQuery(
    ["threads", channelAddress],
    () => api.getUserThreads({ channelAddress }),
    {
      staleTime: 180000,
      enabled: !!channelAddress,
      // retry: false,
      // retryOnMount: false,
      // refetchOnWindowFocus: false,
      // staleTime: Infinity,
    }
  )

  if (channelThreads) {
    console.log(channelThreads)
  }

  return (
    <div className="h-full w-full md:w-1/3">
      <ListToolbar />
      <ListContent threads={threads} />
    </div>
  )
}

export default ListView
