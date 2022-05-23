import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useAccount, useDisconnect, useEnsName } from "wagmi"
import { IoCopySharp } from "react-icons/io5"
import { HiOutlineLogout } from "react-icons/hi"
import { useLayoutStore } from "../../../stores/useLayoutStore"
import { walletSnippet } from "../../../utils/helpers"
import * as api from "query"
import { useQuery } from "react-query"

const AccountDisplay = () => {
  const { data, error, loading } = useAccount()
  const { disconnect } = useDisconnect()
  const setSigner = useLayoutStore(state => state.setSigner)

  const {
    data: getUserData,
    status: getUserStatus,
    mutateAsync: getUser,
  } = useQuery(["signedUser", data?.address], () => api.getUser({ address: data?.address }), {
    enabled: !!data?.address,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  const {
    data: ensData,
    iserror: ensError,
    isloading: ensLoading,
  } = useEnsName({
    address: data?.address,
  })

  const [isDropdownOpen, setDropdownOpen] = React.useState(false)
  const [isCopied, setCopied] = React.useState(false)

  const handleClickAway = React.useCallback(() => {
    if (isDropdownOpen) {
      setDropdownOpen(false)
    }
  }, [isDropdownOpen])

  const handleOpen = React.useCallback(() => {
    if (!isDropdownOpen) {
      setDropdownOpen(true)
    }
  }, [isDropdownOpen])

  const copyToClipBoard = React.useCallback(async () => {
    navigator.clipboard.writeText(data?.address ? data.address : "")
    if (!isCopied) {
      setCopied(true)
    }
    setTimeout(() => setCopied(false), 5000)
  }, [data, isCopied])

  const handleDisconnect = React.useCallback(() => {
    console.log("hi")
    disconnect()
    setSigner(null)
  }, [disconnect, setSigner])

  const dropdown = React.useMemo(() => {
    return isDropdownOpen ? (
      <div className="absolute left-0 top-0 right-0 z-50 w-40 translate-y-16 -translate-x-1 rounded-xl border bg-slate-200 px-2 py-2 text-slate-800 shadow dark:bg-slate-900 dark:text-white">
        <ul>
          <li className="menu-link">
            <button type="button" className="flex font-bold" onClick={copyToClipBoard}>
              <span className="mr-3 self-center">
                <IoCopySharp />
              </span>
              {isCopied ? "Copied Address!" : "Copy Address"}
            </button>
          </li>
          <li className="menu-link">
            <button type="button" className="flex font-bold" onClick={handleDisconnect}>
              <span className="mr-3 self-center">
                <HiOutlineLogout />
              </span>
              Disconnect
            </button>
          </li>
        </ul>
      </div>
    ) : null
  }, [isDropdownOpen, isCopied, copyToClipBoard])

  return data ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="relative rounded-full bg-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
        <button
          type="button"
          className="flex w-max cursor-pointer flex-row rounded-full border border-slate-400 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text p-2 font-semibold text-transparent md:w-min"
          onClick={handleOpen}
        >
          {ensData ? ensData : !ensData && data?.address ? walletSnippet(data?.address) : null}
        </button>
        {dropdown}
      </div>
    </ClickAwayListener>
  ) : null
}

export default AccountDisplay
