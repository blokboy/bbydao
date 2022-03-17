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
    console.log("getting user safes...", "address:", data?.address)
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

  const dropdown = React.useMemo(() => {
    return isDropdownOpen ? (
      <div className="absolute top-0 right-0 z-50 -mt-2 h-auto w-fit origin-top-right translate-y-20 translate-x-0 rounded-xl border bg-slate-200 px-4 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white md:-mr-2 md:-mt-4 md:w-48">
        <ul className="">
          <MainInboxCard clickAway={handleClickAway} />
          {safes?.map((safe, index) => (
            <InboxCard key={index} safe={safe} clickAway={handleClickAway} />
          ))}
        </ul>
      </div>
    ) : null
  }, [isDropdownOpen])

  return (
    <div className="grid w-full grid-cols-3 items-center justify-center p-3">
      <div></div>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="relative">
          <button
            className="flex w-full justify-between rounded-xl p-2 font-bold dark:bg-slate-800"
            onClick={handleInboxDropdown}
          >
            inbox
            <HiChevronDown size={20} />
          </button>
          {dropdown}
        </div>
      </ClickAwayListener>
      <div className="flex justify-center" onClick={setCreateThreadModalOpen}>
        <HiOutlinePlusCircle size={26} />
      </div>
    </div>
  )
}

export default MobileInboxNavigation
