import { ethers } from "ethers"
import React, { useEffect } from "react"
import { FaEthereum } from "react-icons/fa"
import { useDaoStore } from "stores/useDaoStore"
import { isEmpty }     from "utils/helpers"
import RemoveLiquidity from "components/Dao/Uniswap/RemoveLiquidity"
import Modal           from "components/Layout/Modal"
import Swap            from "components/Dao/Uniswap/Swap"

const TokenCard = ({ token }) => {
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const setUniswapSwapModalOpen = useDaoStore(state => state.setUniswapSwapModalOpen)
  const setUniswapLpModalOpen = useDaoStore(state => state.setUniswapLpModalOpen)
  const setUniswapRemoveLpModalOpen = useDaoStore(state => state.setUniswapRemoveLpModalOpen)

  const lpToken0 = useDaoStore(state => state.lpToken0)
  const setLpToken0 = useDaoStore(state => state.setLpToken0)
  const lpToken1 = useDaoStore(state => state.lpToken1)
  const setLpToken1 = useDaoStore(state => state.setLpToken1)
  const isActive =
    lpToken0?.tokenAddress === token?.tokenAddress ||
    lpToken1?.tokenAddress === token?.tokenAddress ||
    (token?.tokenAddress === null && lpToken0?.tokenAddress === WETH) ||
    (token?.tokenAddress === null && lpToken1?.tokenAddress === WETH)
  const isETH = token => parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null
  const isUniV2 = token?.token?.symbol === "UNI-V2"

  const setLpToken = () => {
    if (!isActive) {
      if (Object.keys(lpToken0).length === 0) {
        if (isETH(token)) {
          setLpToken0({
            ...token,
            token: {
              decimals: 18,
              logoUri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
              name: "Ether",
              symbol: "ETH",
            },
            tokenAddress: WETH,
          })
        } else {
          setLpToken0(token)
        }
      }
      if (
        Object.keys(lpToken1).length === 0 &&
        Object.keys(lpToken0).length !== 0 &&
        token.tokenAddress !== lpToken0.tokenAddress
      ) {
        if (isETH(token)) {
          setLpToken1({
            ...token,
            token: {
              decimals: 18,
              logoUri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
              name: "Ether",
              symbol: "ETH",
            },
            tokenAddress: WETH,
          })
        } else {
          setLpToken1(token)
        }
        setUniswapLpModalOpen(true)
      }
    } else {
      setLpToken0({})
    }
  }

  return (
    <div className="flex w-full flex-row justify-between rounded-xl bg-slate-100 p-2 dark:bg-slate-700 xl:flex-col">
      <div className="flex w-full flex-row space-x-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-clip rounded-full border border-white">
          {token?.token?.logoUri ? <img src={token?.token?.logoUri} alt={""} /> : <FaEthereum size={30} />}
        </div>
        <div className="flex h-full w-auto flex-col rounded-xl bg-slate-200 p-1 text-xs dark:bg-slate-600">
          <span>{token.token?.name ? token.token.name : "Ethereum"}</span>
          <span>
            {(token?.balance / 10 ** 18).toFixed(3)} {token.token?.symbol ? token.token.symbol : "ETH"}
          </span>
          <span className="text-teal-600 dark:text-teal-400">${Number(token?.fiatBalance).toFixed(2)}</span>
        </div>
      </div>

        <>
          {(!isUniV2 && (
            <div className="flex flex-row space-x-2 p-1 xl:justify-center">
              {isEmpty(lpToken0) && (
                <>
                  <button
                    className="w-16 rounded-lg bg-blue-400 p-1 text-sm hover:bg-blue-500"
                    onClick={() => console.log("hii")}
                  >
                    send
                  </button>
                  <Modal
                    heading={"Swap"}
                    trigger={
                      <button
                        className="w-16 rounded-lg bg-blue-400 p-1 text-sm hover:bg-blue-500"
                      >
                        swap
                      </button>
                    }
                  >
                    <Swap token={token} />
                  </Modal>
                </>
              )}
              <button className="w-16 rounded-lg bg-blue-400 p-1 text-sm hover:bg-blue-500" onClick={setLpToken}>
                {isEmpty(lpToken0) && isEmpty(lpToken1) ? "LP" : isActive ? "Selected" : "Pair"}
              </button>
            </div>
          )) || (
            <div className="flex flex-row space-x-2 p-1 xl:justify-center">
              <Modal
                heading={"Remove Liquidity"}
                trigger={
                  <button
                    className="w-16 rounded-lg bg-blue-400 p-1 text-sm hover:bg-slate-500"
                  >
                    Manage
                  </button>
                }
              >
                <RemoveLiquidity token={token} />
              </Modal>
            </div>
          )}
        </>
    </div>
  )
}

export default TokenCard
