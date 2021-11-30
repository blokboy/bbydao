import React from "react"
import { useAccountStore } from "../../../stores/useAccountStore"
import SearchBar from "./SearchBar"
import NotificationsIcon from "./NotificationsIcon"
import MessagesIcon from "./MessagesIcon"
import Menu from "./Menu"
import ThemeToggle from "./ThemeToggle"
import AccountDisplay from "./AccountDisplay"
import DisconnectButton from "./DisconnectButton"

const Nav = () => {
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <>
      <nav className="flex w-screen p-2 md:p-6">
        <div className="flex flex-row w-screen justify-between items-center">
          <SearchBar />
        </div>
        {rainbowAccount ? (
          <>
            <AccountDisplay />
            <DisconnectButton />
            <NotificationsIcon />
            <MessagesIcon />
          </>
        ) : (
          <></>
        )}

        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
