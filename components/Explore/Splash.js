import ConnectButton from "components/Layout/Nav/ConnectButton"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useConnect, useAccount } from "wagmi"

const Splash = () => {
  const { data: accountData } = useAccount()

  return (
    <div className="w-screen flex-col items-center justify-center flex">
      <p>welcome to</p>
      <h1 className="m-4 text-5xl">bbyDAO</h1>
      {!accountData ? <ConnectButton /> : <></>}
    </div>
  )
}

export default Splash
