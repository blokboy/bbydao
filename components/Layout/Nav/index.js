import React from "react"
import Link from "next/link"
import NotificationsIcon from "./NotificationsIcon"
import SearchIcon from "./SearchIcon"
import MessagesIcon from "./MessagesIcon"
import Menu from "./Menu"
import ThemeToggle from "./ThemeToggle"
import AccountDisplay from "./AccountDisplay"
import ConnectButton from "./ConnectButton"
import DisconnectButton from "./DisconnectButton"
import ToggleSearchModal from "./ToggleSearchModal"
import { useConnect, useAccount } from "wagmi"

const Nav = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <nav className="z-50 flex h-16 w-full items-center justify-center bg-slate-300 p-3 dark:bg-slate-900 md:mx-0">
      <Link href="/">
        <a className="mr-3 transform transition duration-500 ease-in-out hover:-translate-y-0.5">
          <img src="/babydao.png" alt="bbydao" height={84} width={84} />
        </a>
      </Link>
      <div className="hidden w-full flex-row items-center justify-between md:flex">
        <ToggleSearchModal />
      </div>
      {data?.connected ? <AccountDisplay /> : <></>}
      {data?.connected ? <DisconnectButton /> : <ConnectButton />}
      {data?.connected ? (
        <NotificationsIcon address={accountData.address} />
      ) : (
        <></>
      )}
      {data?.connected ? <MessagesIcon address={accountData.address} /> : <></>}
      <SearchIcon />
      <Menu />
      <ThemeToggle />
    </nav>
  )
}

export default Nav
