import { ethers } from "ethers"
import React from "react"
import { useSigner } from "wagmi"

const RemoveLiquidity = ({ token }) => {
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [{ data: signer }] = useSigner()

  return <div>{console.log("TOKEN", token)}</div>
}

export default RemoveLiquidity
