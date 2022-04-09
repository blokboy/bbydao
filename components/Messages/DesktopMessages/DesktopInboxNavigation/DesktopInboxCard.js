import React               from "react"
import { useQuery }        from "react-query"
import { useMessageStore } from "stores/useMessageStore"
import { walletSnippet }   from "utils/helpers"
import * as api            from "query"

const DesktopInboxCard = ({ safe, clickAway }) => {
  const channelAddress = useMessageStore(state => state.channelAddress)
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  const { data } = useQuery(
    [`${safe}`],
    () => api.getDao({ address: safe }),
    { staleTime: 180000 }
  )

  const handleClick = () => {
    setChannelAddress(safe)
    clickAway()
    setThreadChannel(null)
    if (!mobileThreadView) setMobileThreadView()
  }

  return (
    <li className="py-2" onClick={handleClick}>
      <button className="font-bold">
        {data?.name.length > 0 ? data.name : walletSnippet(safe)}
      </button>
    </li>
  )
}

export default DesktopInboxCard
