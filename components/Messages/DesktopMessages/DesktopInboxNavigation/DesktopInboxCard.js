import React from "react"
import { useQuery } from "react-query"
import { useMessageStore } from "stores/useMessageStore"
import { walletSnippet } from "utils/helpers"
import * as api from "query"

const DesktopInboxCard = ({ safe, clickAway }) => {
  const channelAddress = useMessageStore(state => state.channelAddress)
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  const { data, isFetched } = useQuery(
    [`${safe}`],
    () => api.getDao({ address: safe }),
    {
      staleTime: 180000,
    }
  )

  const handleClick = React.useCallback(() => {
    setChannelAddress(safe)
    clickAway()
    setThreadChannel(null)
    if (!mobileThreadView) setMobileThreadView()
  }, [safe, mobileThreadView])

  const dao = React.useMemo(() => {
    return data && isFetched ? data : null
  }, [data, isFetched])

  const buttonText = React.useMemo(() => {
    return dao ? dao.name : walletSnippet(safe)
  }, [dao, walletSnippet, safe])

  return (
    <li className="py-2" onClick={handleClick}>
      <button className="w-full text-left font-bold">{buttonText}</button>
    </li>
  )
}

export default DesktopInboxCard
