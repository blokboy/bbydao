import React from "react"
import { useDaoStore } from "stores/useDaoStore"
import { HiX } from "react-icons/hi"
import { ChainId, Token, Fetcher, WETH } from "@uniswap/sdk"
import tokenList from "ABIs/tokens"
import useForm from "hooks/useForm"

const UniswapLpModal = ({ safeAddress }) => {
  const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)
  const setUniswapLpModalOpen = useDaoStore(
    state => state.setUniswapLpModalOpen
  )
  const lpToken0 = useDaoStore(state => state.lpToken0)
  const setLpToken0 = useDaoStore(state => state.setLpToken0)
  const lpToken1 = useDaoStore(state => state.lpToken1)
  const setLpToken1 = useDaoStore(state => state.setLpToken1)

  // log token 0 and 1
  console.log("lpToken0", lpToken0)
  console.log("lpToken1", lpToken1)

  const { state, setState, handleChange } = useForm()

  // close uniswap lp modal
  const closeUniswapLpModal = e => {
    if (uniswapLpModalOpen && e.target) {
      setLpToken0({})
      setLpToken1({})
      setUniswapLpModalOpen()
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
  }

  if ((!lpToken0 || !lpToken1) && uniswapLpModalOpen) {
    setUniswapLpModalOpen()
    return null
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

        <form
          className="flex w-full flex-col space-y-8 py-4"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
            <div className="flex flex-row">
              <input
                value={state?.token0}
                onChange={handleChange}
                className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
                id="name"
                name="token0"
                type="number"
                step={0.000001}
                placeholder="0.0"
                required
              />
              {/* Button to select token  */}
              <div className="m-2 w-2/12 rounded-xl bg-slate-200 p-2 text-center text-xl dark:bg-slate-700">
                {lpToken0?.token.symbol ? lpToken0?.token.symbol : ""}
              </div>
            </div>
            <div className="flex w-full flex-row justify-end space-x-2 px-2">
              <div>balance:</div>
              <div>{(lpToken0?.balance / 10 ** 18).toFixed(3)}</div>
            </div>
          </div>

          <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
            <div className="flex flex-row">
              <input
                value={state?.token1}
                onChange={handleChange}
                className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
                id="name"
                name="token1"
                type="number"
                step={0.000001}
                placeholder="0.0"
                required
              />
              {/* Button to select token  */}
              <div className="m-2 w-2/12 rounded-xl bg-slate-200 p-2 text-center text-xl dark:bg-slate-700">
                {lpToken1?.token.symbol ? lpToken1?.token.symbol : ""}
              </div>
            </div>
            <div className="flex w-full flex-row justify-end space-x-2 px-2">
              <div>balance:</div>
              <div>{(lpToken1?.balance / 10 ** 18).toFixed(3)}</div>
            </div>
          </div>

          {/* Price and pool share */}

          <div className="mb-8 w-full">
            <button
              className="focus:shadow-outline h-16 w-full appearance-none rounded-lg border bg-slate-100 py-2 px-3 text-xl leading-tight shadow focus:outline-none dark:bg-slate-800"
              type="submit"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UniswapLpModal
