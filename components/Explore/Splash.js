import ConnectButton from "components/Layout/Nav/ConnectButton"
import React from "react"
import { useConnect, useAccount } from "wagmi"

const Splash = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <div className="hidden h-80 w-screen flex-col items-center justify-center md:flex">
      <p>welcome to</p>
      <h1 className="m-4 text-5xl">babydao</h1>
      {!accountData ? <ConnectButton /> : <></>}
    </div>
  )
}

export default Splash
