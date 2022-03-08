import { OpenSeaPort, Network } from "opensea-js"
import { ethers } from "ethers"
//import * as Web3 from 'web3'

export const createSeaport = async () => {
  await window.ethereum.enable()
  await window.ethereum.request({ method: "eth_requestAccounts" })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const seaport = new OpenSeaPort(provider.provider, {
    networkName: Network.Main,
    apiKey: process.env.OPENSEA_API,
  })

  return seaport
}
