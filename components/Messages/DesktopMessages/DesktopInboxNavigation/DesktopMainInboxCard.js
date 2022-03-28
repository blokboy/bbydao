import React from "react"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"

const DesktopMainInboxCard = ({ clickAway }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const channelAddress = useMessageStore(state => state.channelAddress)
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  const handleClick = () => {
    setChannelAddress(data?.address)
    clickAway()
    setThreadChannel(null)
    if (!mobileThreadView) setMobileThreadView()
  }

  return (
    <li className="py-2" onClick={handleClick}>
      <button className="font-bold">Personal Inbox</button>
    </li>
  )
}

export default DesktopMainInboxCard
