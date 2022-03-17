import React from "react"
import { useMessageStore } from "stores/useMessageStore"
import { useAccount } from "wagmi"

const MainInboxCard = ({ clickAway }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const channelAddress = useMessageStore(state => state.channelAddress)

  const handleClick = () => {
    setChannelAddress(data?.address)
    clickAway()
    setThreadChannel(null)
  }

  return (
    <li className="py-2" onClick={handleClick}>
      <button className="font-bold">Main Inbox</button>
    </li>
  )
}

export default MainInboxCard
