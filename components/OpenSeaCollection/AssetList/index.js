import React from "react"
import AssetCard from "./AssetCard"

import { ethers } from "ethers"
import { OpenSeaPort, Network } from "opensea-js"

const AssetList = ({ assets }) => {
  let seaport

  React.useEffect(() => {
    if (seaport) return
    setSeaport()
  }, [])

  const setSeaport = async () => {
    if (seaport) return
    await window.ethereum.enable()
    await window.ethereum.request({ method: "eth_requestAccounts" })

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    seaport = new OpenSeaPort(provider, {
      networkName: Network.Main,
      apiKey: process.env.OPENSEA_API,
    })

    console.log(seaport)
  }

  return (
    <div className="mx-4 grid w-full grid-cols-1 justify-items-center gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset, index) => (
        <AssetCard key={index} asset={asset} />
      ))}
    </div>
  )
}

export default AssetList
