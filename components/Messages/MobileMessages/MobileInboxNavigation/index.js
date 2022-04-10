import React from "react"
import MainInboxCard from "./MainInboxCard"
import InboxCard from "./InboxCard"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useAccount } from "wagmi"
import { useUiStore } from "stores/useUiStore"
import ClickAwayListener from "react-click-away-listener"
import { HiOutlinePlusCircle, HiChevronDown } from "react-icons/hi"

const MobileInboxNavigation = () => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const setCreateThreadModalOpen = useUiStore(
    state => state.setCreateThreadModalOpen
  )

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
      <div className="absolute top-[100%] right-0 left-0 z-50 h-auto w-full rounded-xl rounded-tr-none rounded-tl-none border border-t-0 border-slate-600 bg-slate-100 px-2 text-sm text-slate-800 shadow dark:border-slate-200 dark:bg-slate-800 dark:text-white">
        <ul className="">
          <MainInboxCard clickAway={handleClickAway} />
          {safes?.map((safe, index) => (
            <InboxCard key={index} safe={safe} clickAway={handleClickAway} />
          ))}
        </ul>
      </div>
    ) : null
  }, [isDropdownOpen])

  const inboxButtonClasses = React.useMemo(() => {
    return `flex w-full justify-between bg-slate-200 border border-transparent rounded-xl p-2 font-bold dark:bg-slate-800 ${
      isDropdownOpen
        ? "border-slate-600 dark:border-slate-100 rounded-br-none rounded-bl-none"
        : ""
    }`
  }, [isDropdownOpen])

  return (
    <div className="flex w-full items-center justify-center p-3">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="relative w-full mr-4">
          <button className={inboxButtonClasses} onClick={handleInboxDropdown}>
            inbox
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

export default MobileInboxNavigation
