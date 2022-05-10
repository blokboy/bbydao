import { ethers } from "ethers"
import React from "react"
import { useSigner } from "wagmi"
import { useDaoStore } from "../../../stores/useDaoStore"
import ControlledModal from "../../Layout/Modal/ControlledModal"

const RemoveLiquidity = ({ safeAddress, tokenLogos }) => {
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [{ data: signer }] = useSigner()
  const setUniswapRemoveLpModalOpen = useDaoStore(state => state.setUniswapRemoveLpModalOpen)

  const closeUniswapRemoveLpModal = () => {
    setUniswapRemoveLpModalOpen()
  }

  return (
    <ControlledModal close={closeUniswapRemoveLpModal} heading={"Add Liquidity"}>
      {safeAddress}
    </ControlledModal>
  )
}

export default RemoveLiquidity
