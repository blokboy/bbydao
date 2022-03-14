import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"
import { useQuery } from "react-query"
import * as api from "query"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"

const ListView = () => {
  // get user or dao threads (address)
  // will need to put address into state, once that value is there, fetch threads
  const { channelAddress } = useMessageStore()
  const [{ data, error, loading }, disconnect] = useAccount()

  // set users safes to state (safes), to pass down to ListContent as props
  // might switch out to query our backend for bbydaos(safes) that user is a member of
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )
  const [safes, setSafes] = React.useState()
  const getUserSafes = async () => {
    if (!data?.address) return
    const safes = await safeService.getSafesByOwner(data?.address)
    setSafes(safes.safes)
  }
  React.useEffect(() => {
    console.log("getting user safes...", "address:", data?.address)
    getUserSafes()
  }, [loading])

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

  return (
    <div className="h-full w-full md:w-1/3">
      <ListToolbar />
      <ListContent threads={channelThreads} safes={safes} />
    </div>
  )
}

export default ListView
