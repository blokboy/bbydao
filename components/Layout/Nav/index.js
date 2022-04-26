import React from "react"
import Link from "next/link"
import { useConnect, useAccount } from "wagmi"

import NotificationsIcon from "./NotificationsIcon"
import SearchIcon from "./SearchIcon"
import MessagesIcon from "./MessagesIcon"
import Menu from "./Menu"
import ThemeToggle from "./ThemeToggle"
import AccountDisplay from "./AccountDisplay"
import ConnectButton from "./ConnectButton"
import DisconnectButton from "./DisconnectButton"
import ToggleSearchModal from "./ToggleSearchModal"
import NetworkIconDropdown from "./NetworkIconDropdown"

const Nav = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <nav className="z-50 flex h-16 w-full items-center justify-between bg-slate-300 p-3 dark:bg-slate-900 sticky top-0">
      <div className="flex md:w-full">
        <Link href={data?.connected ? `/user/${accountData?.address}` : `/`}>
          <a className="mr-3 flex w-10 transform transition duration-500 ease-in-out hover:-translate-y-0.5 md:w-auto">
            <img src="/babydao.png" alt="bbydao" height={60} width={60} />
          </a>
        </Link>
        <div className="hidden w-full flex-row items-center justify-between md:flex">
          <ToggleSearchModal />
        </div>
        <div className="md:hidden">
          <SearchIcon />
        </div>
      </div>
      <div className="flex mr-2">
        {data?.connected ? (
          <>
            <NetworkIconDropdown />
            <MessagesIcon address={accountData.address} />
            <NotificationsIcon address={accountData.address} />
            <AccountDisplay />
          </>
        ) : null}
        {!data?.connected ? <ConnectButton /> : null}
        <Menu />
      </div>

      <ThemeToggle />
    </nav>
  )
}

export default Nav
