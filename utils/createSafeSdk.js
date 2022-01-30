import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { ethers } from "ethers"

export const createSafeSdk = async safeAddress => {
  if (!safeAddress) {
    console.log("createSafeSdk error: no safe address")
    return
  }

  await window.ethereum.enable()
  await window.ethereum.request({ method: "eth_requestAccounts" })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(provider.provider.selectedAddress)

  const ethAdapter = new EthersAdapter({ ethers, signer })
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  })

  return safeSdk
}
