import {ethers}      from 'ethers'
import React         from 'react'
import Modal         from 'components/Layout/Modal'
import {useSigner}   from 'wagmi'
import {useDaoStore} from '../../../stores/useDaoStore'

const RemoveLiquidity = ({safeAddress, tokenLogos}) => {
    const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
    const [{ data: signer }] = useSigner()
    const setUniswapRemoveLpModalOpen = useDaoStore(state => state.setUniswapRemoveLpModalOpen)

    const closeUniswapRemoveLpModal = () => {
        setUniswapRemoveLpModalOpen()
    }

    return (
        <Modal close={closeUniswapRemoveLpModal} heading={"Add Liquidity"}>
            {safeAddress}
        </Modal>
    )
}

export default RemoveLiquidity
