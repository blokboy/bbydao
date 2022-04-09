import React                         from "react"
import { useMessageStore }           from "stores/useMessageStore"
import { HiOutlineArrowCircleRight } from "react-icons/hi"
import { walletSnippet }             from "utils/helpers"

const DesktopThreadCard = ({ title, thread }) => {
  const { setThreadChannel } = useMessageStore()
  const threadChannel = useMessageStore(state => state.threadChannel)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  const handleClickCard = () => {
    setThreadChannel(thread.channel)
    setMobileThreadView()
  }

  const isActive = threadChannel === thread.channel

  const parseTitle = (_addresses) => {
    const parsedTitles = []

    const addresses = _addresses.replace(/\s/g, '').split(',')
    for(const addr of addresses) {
      const str = walletSnippet(addr)
      parsedTitles.push(str)
    }

    return parsedTitles
  }

  return (
    <li
      className={
        "mb-2 flex w-full flex-row rounded-lg bg-slate-200 hover:bg-slate-100 p-3 dark:bg-slate-800 hover:cursor-pointer dark:hover:bg-slate-700" +
        (isActive ? "  text-[#FC8D4D]" : "")
      }
      onClick={handleClickCard}
    >
      <div className="ml-3 flex w-11/12 flex-col pl-3">
        <span className="text-sm font-bold">
          {" "}
          {parseTitle(title)[0]}
        </span>
      </div>
      <div className="self-center">
        <HiOutlineArrowCircleRight size={24} />
      </div>
    </li>
  )
}

export default DesktopThreadCard
