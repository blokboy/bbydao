import React from "react"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import ClickAwayListener from "react-click-away-listener"
import { HiChevronDown, HiOutlinePlusCircle } from "react-icons/hi"
import { useAccount } from "wagmi"
import { useMessageStore } from "stores/useMessageStore"
import { useUiStore } from "stores/useUiStore"
import { walletSnippet } from "utils/helpers"
import DesktopInboxCard from "./DesktopInboxCard"
import DesktopMainInboxCard from "./DesktopMainInboxCard"

export default function DesktopInboxNavigation() {
  const [{ data, error, loading }, disconnect] = useAccount()
  const setCreateThreadModalOpen = useUiStore(
    state => state.setCreateThreadModalOpen
  )
  const channelAddress = useMessageStore(state => state.channelAddress)

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
    getUserSafes()
  }, [loading])

  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  const handleInboxDropdown = React.useCallback(() => {
    setDropdownOpen(true)
  }, [])

  const handleClickAway = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  const handleCreateThread = React.useCallback(() => {
    setCreateThreadModalOpen(true)
  }, [setCreateThreadModalOpen])

  const dropdown = React.useMemo(() => {
    return isDropdownOpen ? (
      <div className="absolute top-[100%] right-0 left-0 z-50 h-auto w-full rounded-xl rounded-tl-none rounded-tr-none border border-t-0 border-slate-700 bg-slate-100 px-2 text-sm text-slate-800 shadow dark:border-slate-100 dark:bg-slate-800 dark:text-white">
        <ul className="">
          <DesktopMainInboxCard clickAway={handleClickAway} />
          {safes?.map((safe, index) => (
            <DesktopInboxCard
              key={index}
              safe={safe}
              clickAway={handleClickAway}
            />
          ))}
        </ul>
      </div>
    ) : null
  }, [isDropdownOpen])

  const inboxButtonClasses = React.useMemo(() => {
    return `bg-slate-100 flex w-full border border-transparent items-center justify-between rounded-xl p-2 px-4 font-bold dark:bg-slate-800 ${
      isDropdownOpen
        ? "border-slate-700 dark:border-slate-100 rounded-br-none rounded-bl-none"
        : ""
    }`
  }, [isDropdownOpen])

  return (
    <div className="flex w-full items-center justify-end p-3">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="relative mr-4 w-full">
          <button className={inboxButtonClasses} onClick={handleInboxDropdown}>
            {data?.address === channelAddress
              ? "personal"
              : walletSnippet(channelAddress) || "no channel"}
            <HiChevronDown size={20} />
          </button>
          {dropdown}
        </div>
      </ClickAwayListener>
      <div className="flex justify-center" onClick={handleCreateThread}>
        <HiOutlinePlusCircle size={28} />
      </div>
    </div>
  )
}
