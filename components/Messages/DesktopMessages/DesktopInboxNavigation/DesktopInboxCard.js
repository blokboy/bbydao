import React from "react"
import { useMessageStore } from "stores/useMessageStore"

const DesktopInboxCard = ({ safe, clickAway }) => {
  const channelAddress = useMessageStore(state => state.channelAddress)
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
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
        {safe?.length > 30 ? safe.substring(0, 6).concat("...").concat(safe.substring(safe.length - 4, safe.length)) : safe}
      </button>
    </li>
  )
}

export default DesktopInboxCard
