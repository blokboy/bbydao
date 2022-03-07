import React from "react"
import { HiOutlineArrowCircleRight } from "react-icons/hi"
import { useMessageStore } from "stores/useMessageStore"

const UserInboxCard = ({ address, setInboxView }) => {
  const setChannelAddress = useMessageStore(set => set.setChannelAddress)
  const setThreadChannel = useMessageStore(set => set.setThreadChannel)
  const channelAddress = useMessageStore(state => state.channelAddress)

  const handleClick = () => {
    setChannelAddress(address)
    setInboxView()
    setThreadChannel(null)
  }

  return (
    <li
      className={
        "mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-800" +
        (channelAddress === address ? " text-blue-500" : "")
      }
      onClick={handleClick}
    >
      <div className="ml-3 flex w-11/12 flex-col pl-3">
        <span className="text-sm font-bold">Main Channel</span>
      </div>
      <div className="self-center">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default UserInboxCard
