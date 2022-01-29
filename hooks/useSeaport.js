import React from "react"
import { ethers } from "ethers"
import { OpenSeaPort, Network } from "opensea-js"

const useSeaport = () => {
  const [seaport, setSeaport] = React.useState()

  React.useEffect(() => {
    if (seaport) return
    createSeaport()
  }, [])

  const createSeaport = async () => {
    if (seaport) return
    await window.ethereum.enable()
    await window.ethereum.request({ method: "eth_requestAccounts" })

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main,
      apiKey: process.env.OPENSEA_API,
    })

    setSeaport(seaport)
  }

  return { seaport }
}

export default useSeaport
