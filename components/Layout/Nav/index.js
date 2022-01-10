import React from "react"
import { useAccountStore } from "stores/useAccountStore"
import NotificationsIcon from "./NotificationsIcon"
import MessagesIcon from "./MessagesIcon"
import Menu from "./Menu"
import ThemeToggle from "./ThemeToggle"
import AccountDisplay from "./AccountDisplay"
import DisconnectButton from "./DisconnectButton"
import ToggleSearchModal from "./ToggleSearchModal"
import { useConnect } from "wagmi"

const Nav = () => {
  const [{ data, error }, connect] = useConnect()

  const userData = useAccountStore(state => state.userData)

  return (
    <>
      <nav className="flex w-screen p-2 md:p-6">
        <div className="flex flex-row w-screen justify-between items-center">
          {userData && data?.connected ? <ToggleSearchModal /> : <></>}
        </div>
        {userData && data?.connected ? <AccountDisplay /> : <></>}
        {userData && data?.connected ? <DisconnectButton /> : <></>}
        {userData && data?.connected ? (
          <NotificationsIcon id={userData.id} />
        ) : (
          <></>
        )}
        {userData && data?.connected ? <MessagesIcon /> : <></>}
        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
