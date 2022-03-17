import React from "react"
import { useMessageStore } from "stores/useMessageStore"

const InboxCard = ({ safe, clickAway }) => {
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const channelAddress = useMessageStore(state => state.channelAddress)

  const handleClick = () => {
    setChannelAddress(safe)
    clickAway()
    setThreadChannel(null)
  }

  return (
    <li className="py-2" onClick={handleClick}>
      <button className="font-bold">
        {safe?.length > 30 ? safe.substring(0, 10).concat("...") : safe}
      </button>
    </li>
  )
}

export default InboxCard
