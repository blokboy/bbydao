import ConnectButton from "components/Layout/Nav/ConnectButton"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useConnect, useAccount } from "wagmi"

const Splash = () => {
  const { data: accountData, disconnect } = useAccount()
  const { isConnected } = useConnect()

  return (
    <div className="hidden h-80 w-screen flex-col items-center justify-center md:flex">
      <p>welcome to</p>
      <h1 className="m-4 text-5xl">bbyDAO</h1>
      {!isConnected ? <ConnectButton /> : <></>}
    </div>
  )
}

export default Splash
