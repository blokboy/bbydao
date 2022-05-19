import { ethers } from "ethers"
import React, { useEffect } from "react"
import { FaEthereum } from "react-icons/fa"
import { useDaoStore } from "stores/useDaoStore"
import { isEmpty } from "utils/helpers"
import RemoveLiquidity from "components/Dao/Uniswap/RemoveLiquidity"
import Modal from "components/Layout/Modal"
import Swap from "components/Dao/Uniswap/Swap"

const TokenCard = ({ token }) => {
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const setUniswapLpModalOpen = useDaoStore(state => state.setUniswapLpModalOpen)

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

  const Button = ({ name, click, isActive }) => (
    <button
      type="button"
      className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800 ${
        isActive ? `bg-blue-400 dark:bg-blue-400` : ""
      }`}
      onClick={click}
    >
      {name}
    </button>
  )

  return (
    <div className="flex w-full flex-row rounded-xl bg-slate-100 p-2 shadow-xl dark:bg-slate-900 xl:flex-col">
      <div className="mb-2 flex w-full flex-col">
        <div className="flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            {(isUniV2 && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Uniswap_Logo.svg" alt="Uniswap Logo" />
            )) || (
              <>{token?.token?.logoUri ? <img src={token?.token?.logoUri} alt={""} /> : <FaEthereum size={30} />}</>
            )}
          </div>
          <span className="text-xl font-normal">
            {(isUniV2 && <>{token.token?.name.replace("Uniswap V2", "").replace("Pool", "LP")}</>) || (
              <>{token.token?.name ? token.token.name : "Ethereum"}</>
            )}
          </span>
        </div>
        <div className="flex h-full w-auto flex-col p-2">
          <span className="text-sm font-thin">
            {(token?.balance / 10 ** 18).toFixed(3)} {token.token?.symbol ? token.token.symbol : "ETH"}
          </span>
          <span className="text-xs font-thin text-teal-600 dark:text-teal-400">
            ${Number(token?.fiatBalance).toFixed(2)}
          </span>
        </div>
      </div>

      <>
        {(!isUniV2 && (
          <div className="flex flex-wrap p-1 xl:justify-center">
            {isEmpty(lpToken0) && (
              <>
                <Button name={"Send"} />
                <Modal
                  heading={
                    <div className="flex items-center">
                      <div className="h-8 w-8 overflow-hidden rounded-full" title="Uniswap V2 Swap">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Uniswap_Logo.svg" />
                      </div>
                      <div className="flex items-center text-xl font-normal">
                        Swap <span className="ml-2 pt-[.1rem] text-xs">Uniswap (V2)</span>
                      </div>
                    </div>
                  }
                  trigger={
                    <button
                      type="button"
                      className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800 ${
                        isActive ? `bg-blue-400 dark:bg-blue-400` : ""
                      }`}
                    >
                      Swap
                    </button>
                  }
                >
                  <Swap token={token} />
                </Modal>
              </>
            )}
            <Button
              name={isEmpty(lpToken0) && isEmpty(lpToken1) ? "LP" : isActive ? "Selected" : "Pair"}
              click={setLpToken}
              isActive={isActive}
            />
          </div>
        )) || (
          <div className="flex flex-row p-1 xl:justify-center">
            <Modal
              heading={"Remove Liquidity"}
              trigger={
                <button
                  type="button"
                  className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800 ${
                    isActive ? `bg-blue-400 dark:bg-blue-400` : ""
                  }`}
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
