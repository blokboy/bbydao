import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"

const ListView = ({ threads }) => {
  // get user or dao threads (address)
  // will need to put address into state, once that value is there, fetch threads
  const { channelAddress } = useMessageStore()

  const [{ data, error, loading }, disconnect] = useAccount()
  const [safes, setSafes] = React.useState()
  const getUserSafes = async () => {
    if (!data?.address) return
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    const safes = await safeService.getSafesByOwner(data?.address)
    setSafes(safes.safes)
  }
  React.useEffect(() => {
    if (!data.address) return
    getUserSafes()
  }, [])

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
      <ListContent threads={threads} safes={safes} />
    </div>
  )
}

export default ListView
