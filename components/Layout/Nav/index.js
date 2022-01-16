import React from "react"
import NotificationsIcon from "./NotificationsIcon"
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

  console.log("nav accountData:", accountData)
  console.log("nav data:", data)

  return (
    <>
      <nav className="flex w-screen p-2 md:p-6">
        <div className="flex flex-row w-screen justify-between items-center">
          {data?.connected ? <ToggleSearchModal /> : <></>}
        </div>
        {data?.connected ? <AccountDisplay /> : <></>}
        {data?.connected ? <DisconnectButton /> : <ConnectButton />}
        {/* {data?.connected ? <NotificationsIcon id={userData.id} /> : <></>} */}
        {data?.connected ? <MessagesIcon /> : <></>}
        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
