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

  console.log("nav userData:", userData)
  console.log("nav data:", data)

  return (
    <>
      <nav className="flex w-screen p-2 md:p-6">
        <div className="flex flex-row w-screen justify-between items-center">
          {data?.connected && userData ? <ToggleSearchModal /> : <></>}
        </div>
        {data?.connected && userData ? <AccountDisplay /> : <></>}
        {data?.connected && userData ? <DisconnectButton /> : <></>}
        {data?.connected && userData ? (
          <NotificationsIcon id={userData.id} />
        ) : (
          <></>
        )}
        {data?.connected && userData ? <MessagesIcon /> : <></>}
        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
