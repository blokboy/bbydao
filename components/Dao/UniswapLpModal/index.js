import React from "react"
import { useDaoStore } from "stores/useDaoStore"
import { HiX } from "react-icons/hi"

const UniswapLpModal = ({ safeAddress }) => {
  const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)
  const tokenData = useDaoStore(state => state.tokenData)
  const setUniswapLpModalOpen = useDaoStore(
    state => state.setUniswapLpModalOpen
  )

  console.log(
    "UniswapLpModal.js: tokenData:",
    tokenData,
    "safeAddress:",
    safeAddress
  )

  // close uniswap lp modal
  const closeUniswapLpModal = e => {
    if (uniswapLpModalOpen && e.target) {
      setUniswapLpModalOpen({})
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => closeUniswapLpModal(e)}>
      <div className="modal-container" onClick={e => closeUniswapLpModal(e)}>
        <div className="flex w-full justify-end">
          <button
            className="modal-close-btn"
            onClick={e => closeUniswapLpModal(e)}
          >
            <HiX />
          </button>
        </div>
        <div className="w-full text-center text-xl font-bold">Uniswap LP</div>
        <div className="w-full text-center text-xl font-bold">Coming Soon</div>
      </div>
    </div>
  )
}

export default UniswapLpModal
