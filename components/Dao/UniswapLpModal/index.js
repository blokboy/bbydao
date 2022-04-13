import useForm                    from "hooks/useForm"
import React, { useMemo, useRef } from "react"
import { HiX }                    from "react-icons/hi"
import { Portal, PortalWithState } from "react-portal"
import { useDaoStore } from "stores/useDaoStore"
import Modal from "components/Layout/Modal"
import { ChainId, Fetcher, WETH, Route, Pair, Token } from "@uniswap/sdk"

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
  // console.log("lpToken0", lpToken0)
  // console.log("lpToken1", lpToken1)

  const { state, setState, handleChange } = useForm()

  // close uniswap lp modal
  const closeUniswapLpModal = e => {
    setLpToken0({})
    setLpToken1({})
    setUniswapLpModalOpen()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const daiToken = lpToken0?.token.symbol === "WETH" ? lpToken1 : lpToken0
    const chainId = ChainId.MAINNET
    const dai = await Fetcher.fetchTokenData(chainId, daiToken.tokenAddress)
    const weth = WETH[chainId]
    const pair = await Fetcher.fetchPairData(dai, weth)
    const route = new Route([pair], weth)
    console.log("route midprice", route?.midPrice.toSignificant(6))
    console.log(
      "route midprice invert",
      route?.midPrice.invert().toSignificant(6)
    )
    console.log("route", route)
  }

  if ((!lpToken0 || !lpToken1) && uniswapLpModalOpen) {
    setUniswapLpModalOpen()
    return null
  }

  const selectedPair = useMemo(() => {
    const token0 = new Token(
      ChainId.MAINNET,
      lpToken0?.tokenAddress,
      lpToken0?.token?.decimals,
      lpToken0?.token?.symbol,
      lpToken0?.token?.name
    );

    const token1 = new Token(
      ChainId.MAINNET,
      lpToken1?.tokenAddress,
      lpToken1?.token?.decimals,
      lpToken1?.token?.symbol,
      lpToken1?.token?.name
    );

    return [token0, token1]

  }, [lpToken0, lpToken1])

  const token0InputRef = useRef()
  const token1InputRef = useRef()

  const handleSetValue = (e, token) => {
    const bal = token?.balance
    const dec = token?.token?.decimals
    const max =  bal / 10 ** dec
    const input = e?.target?.valueAsNumber
    const name = e?.target?.name

    if(input > max) {
      setState(state => ({ ...state, [name]: max }))
    } else {
      handleChange(e)
    }
  }

  const readableBalance = (token) => {
    return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
  }

  const setMax = (token, ref) => {
    const name = ref?.current?.name
    const max = ref?.current?.max
    setState(state => ({ ...state, [name]: max }))
  }


  return (
    <Modal close={closeUniswapLpModal} heading={"Uniswap LP"}>
      <form
        className="flex w-full flex-col space-y-8 py-4"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
          <div className="flex flex-row">
            <input
              value={state?.token0}
              onChange={(e) => handleSetValue(e, lpToken0)}
              className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
              id="name"
              name="token0"
              type="number"
              step={0.000001}
              placeholder="0.0"
              required
              max={lpToken0?.balance / 10 ** lpToken0?.token?.decimals}
              ref={token0InputRef}
            />
            {/* Button to select token  */}
            <div className="m-2 w-2/12 rounded-xl bg-slate-200 p-2 text-center text-xl dark:bg-slate-700">
              {lpToken0?.token?.symbol ? lpToken0?.token?.symbol : ""}
            </div>
          </div>
          <div className="flex w-full flex-row justify-end space-x-2 px-2">
            <div>balance:</div>
            <div>{readableBalance(lpToken0)}</div>
          </div>
          <div className="mr-3 flex cursor-pointer justify-end text-[#FC8D4D]">
            max
          </div>
        </div>

        <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
          <div className="flex flex-row">
            <input
              value={state?.token1}
              onChange={(e) => handleSetValue(e, lpToken1)}
              className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
              id="name"
              name="token1"
              type="number"
              step={0.000001}
              placeholder="0.0"
              required
              max={lpToken1?.balance / 10 ** lpToken1?.token?.decimals}
              ref={token1InputRef}
            />
            {/* Button to select token  */}
            <div className="m-2 w-2/12 rounded-xl bg-slate-200 p-2 text-center text-xl dark:bg-slate-700">
              {lpToken1?.token?.symbol ? lpToken1?.token?.symbol : ""}
            </div>
          </div>
          <div className="flex w-full flex-row justify-end space-x-2 px-2">
            <div>balance:</div>
            <div>{readableBalance(lpToken1)}</div>
          </div>
          <div
            className="mr-3 flex cursor-pointer justify-end text-[#FC8D4D]"
            onClick={() => setMax(lpToken1, token1InputRef)}
          >
            max
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
    </Modal>
  )
}

export default UniswapLpModal
