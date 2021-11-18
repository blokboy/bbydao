import React from "react"
import { useAccountStore } from "../../../stores/useAccountStore"
import SearchBar from "./SearchBar"
import ThemeToggle from "./ThemeToggle"
import Menu from "./Menu"
import AccountDisplay from "./AccountDisplay"
import DisconnectButton from "./DisconnectButton"

const Nav = () => {
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <>
      <nav className="flex w-screen py-6 px-8">
        <div className="flex flex-row w-screen justify-between items-center">
          <div className="block md:hidden text-2xl font-extrabold">babydao</div>
          <SearchBar />
        </div>
        {rainbowAccount ? <AccountDisplay /> : <></>}
        {rainbowAccount ? <DisconnectButton /> : <></>}
        <Menu />
        <ThemeToggle />
      </nav>
    </>
  )
}

export default Nav
