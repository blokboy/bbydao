import React from "react"
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
    <>
      <nav className="flex w-screen p-2 md:p-6">
        <div className="flex w-screen flex-row items-center justify-between">
          {data?.connected ? <ToggleSearchModal /> : <></>}
        </div>
        {data?.connected ? <AccountDisplay /> : <></>}
        {data?.connected ? <DisconnectButton /> : <ConnectButton />}
        {data?.connected ? (
          <NotificationsIcon address={accountData.address} />
        ) : (
          <></>
        )}
        {data?.connected ? <MessagesIcon /> : <></>}
        <SearchIcon />
        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
