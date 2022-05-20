import React from "react"
import AddLiquidity from "components/Dao/Uniswap/AddLiquidity"
import RemoveLiquidity from "components/Dao/Uniswap/RemoveLiquidity"
import Swap from "components/Dao/Uniswap/Swap"
import Modal from "components/Layout/Modal"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"

const TokenControls = ({ liquidityPair, token, isUniV2, treasury }) => {
  const [toggleControls, setToggleControls] = React.useState(false)

  /* Check if user has enough tokens to LP  */
  const hasTokensToLp = React.useMemo(() => {
    return treasury.filter(token => parseFloat(token?.fiatBalance) > 0 && token?.token?.symbol !== "UNI-V2")?.length >= 2
  }, [treasury])

  return (
    <>
      {!toggleControls && (
        <button
          type="button"
          className="flex justify-center rounded bg-slate-200 shadow-xl dark:bg-slate-800"
          onClick={() => setToggleControls(state => !state)}
        >
          <HiChevronDown size={24} />
        </button>
      )}
      <div className={`${!toggleControls ? "h-0" : "h-auto"} overflow-hidden transition-all`}>
        {(!isUniV2 && (
          <div className="flex flex-wrap p-1 xl:justify-center">
            <button
              type="button"
              className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
            >
              Send
            </button>
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
                  className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
                >
                  Swap
                </button>
              }
            >
              <Swap token={token} />
            </Modal>
            {hasTokensToLp && (
              <Modal
                heading={"Add Liquidity"}
                trigger={
                  <button
                    type="button"
                    className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
                  >
                    LP
                  </button>
                }
              >
                <AddLiquidity lpToken0={token} />
              </Modal>
            )}
          </div>
        )) || (
          <div className="flex flex-wrap p-1 xl:justify-center">
            <Modal
              heading={"Remove Liquidity"}
              trigger={
                <button
                  type="button"
                  className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
                >
                  Remove Liquidity
                </button>
              }
            >
              <RemoveLiquidity token={token} />
            </Modal>
            {!!liquidityPair && (
              <Modal
                heading={"Add Liquidity"}
                trigger={
                  <button
                    type="button"
                    className={`mb-2 w-full rounded-lg bg-slate-300 p-2 text-sm text-white hover:bg-blue-600 hover:bg-blue-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
                  >
                    Add Liquidity
                  </button>
                }
              >
                <AddLiquidity lpToken0={liquidityPair?.lpToken0} token1={liquidityPair?.lpToken1} />
              </Modal>
            )}
          </div>
        )}
      </div>
      {toggleControls && (
        <button
          type="button"
          className="flex justify-center rounded bg-slate-200 shadow-xl dark:bg-slate-800"
          onClick={() => setToggleControls(state => !state)}
        >
          <HiChevronUp size={24} />
        </button>
      )}
    </>
  )
}

export default TokenControls
