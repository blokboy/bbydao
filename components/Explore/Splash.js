import ConnectButton from "components/Layout/Nav/ConnectButton"
import React from "react"
import { useConnect, useAccount } from "wagmi"

const Splash = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <div className="hidden md:flex flex-col w-screen h-80 justify-center items-center">
      <p>welcome to</p>
      <h1 className="text-5xl m-4">babydao</h1>
      {!accountData ? <ConnectButton /> : <></>}
    </div>
  )
}

export default Splash
