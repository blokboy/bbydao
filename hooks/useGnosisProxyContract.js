import React from "react"
import { Contract } from "ethers"
import { useSigner } from "wagmi"

const minimalABI = [
  {
    inputs: [{ internalType: "address", name: "_singleton", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { stateMutability: "payable", type: "fallback" },
]

export default function useGnosisProxyContract(address, gnosis) {
  const [{ data: signer }] = useSigner()
  console.log('signer', signer)
  console.log('gn', address)

  const contract = React.useMemo(() => {
    return address && signer ? new Contract(address, minimalABI, !gnosis ? signer : address) : null
  }, [address, signer])

  return contract
}
