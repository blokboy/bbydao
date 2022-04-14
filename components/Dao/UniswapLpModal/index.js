import {ChainId, Fetcher, Route, Token, TokenAmount, WETH} from "@uniswap/sdk"
import IUniswapV2ERC20                                     from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import Modal                                               from "components/Layout/Modal"
import {BigNumber, ethers}                                 from 'ethers'
import {formatUnits}                                       from 'ethers/lib/utils'
import useForm                                             from "hooks/useForm"
import React, {useEffect, useMemo, useRef, useState}       from "react"
import {useDaoStore}                                       from "stores/useDaoStore"
import {eToNumber}                                         from 'utils/helpers'


const UniswapLpModal = ({safeAddress}) => {
    const chainId = ChainId.MAINNET
    const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)
    const setUniswapLpModalOpen = useDaoStore(
        state => state.setUniswapLpModalOpen
    )
    const lpToken0 = useDaoStore(state => state.lpToken0)
    const setLpToken0 = useDaoStore(state => state.setLpToken0)
    const lpToken1 = useDaoStore(state => state.lpToken1)
    const setLpToken1 = useDaoStore(state => state.setLpToken1)

    const {state, setState, handleChange} = useForm()

    /*  Create reference to input of token */
    const token0InputRef = useRef()
    const token1InputRef = useRef()
    const [globalPair, setGlobalPair] = useState()

    const init = async () => {
        setState(state => ({...state, [token0InputRef?.current?.name]: 0}))
        setState(state => ({...state, [token1InputRef?.current?.name]: 0}))
        const uniPair = await Fetcher.fetchPairData(selectedTokens[token0InputRef?.current?.name], selectedTokens[token1InputRef?.current?.name])
        await setGlobalPair(uniPair)
    }

    useEffect(() => {
        init()


    }, [])

    // close uniswap lp modal
    const closeUniswapLpModal = e => {
        setLpToken0({})
        setLpToken1({})
        setUniswapLpModalOpen()
        setMaxError("")
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


    const totalSupply = async (pair) => {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(pair.liquidityToken.address, IUniswapV2ERC20.abi, provider)
        const supply = await contract.totalSupply()

        return supply
    }


    /*  Construct object of selected tokens represented as Uniswap Token Objects */
    const selectedTokens = useMemo(() => {
        const token0 = new Token(
            ChainId.MAINNET,
            lpToken0?.tokenAddress,
            lpToken0?.token?.decimals,
            lpToken0?.token?.symbol,
            lpToken0?.token?.name
        )

        const token1 = new Token(
            ChainId.MAINNET,
            lpToken1?.tokenAddress,
            lpToken1?.token?.decimals,
            lpToken1?.token?.symbol,
            lpToken1?.token?.name
        )

        return {token0, token1}

    }, [lpToken0, lpToken1])


    const readableBalance = (token) => {
        return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
    }

    const handleSetValue = async (e, token, ref) => {
        const bal = token?.balance
        const dec = token?.token?.decimals
        const max = bal / 10 ** dec
        const input = e?.target?.valueAsNumber
        const name = e?.target?.name
        const pairToken = name === "token0" ? lpToken1 : lpToken0
        const pairTokenRef = name === "token0" ? token1InputRef : token0InputRef
        const pairValue = Number((input * token?.fiatConversion) / pairToken?.fiatConversion)

        if (input > max) {
            setMax(token, ref)
        } else {
            setState(state => ({...state, [ref?.current?.name]: input}))
            setState(state => ({...state, [pairTokenRef?.current?.name]: pairValue}))
            setMaxError("")

            if (!isNaN(input) && !isNaN(pairValue) && input > 0 && pairValue > 0) {
                const liquidityInfo = await getLiquidityTokenInfo({
                    uniPair: globalPair,
                    token0: token,
                    token0Ref: ref,
                    token0Input: input.toFixed(10),
                    token1: pairToken,
                    token1Ref: pairTokenRef,
                    token1Input: pairValue.toFixed(10)
                })
                setLiquidityInfo(liquidityInfo)
            }
        }
    }

    const getLiquidityTokenInfo = async ({uniPair, token0, token0Ref, token0Input, token1, token1Input, token1Ref}) => {
        if (!!uniPair) {
            const total = await totalSupply(uniPair)
            const totalTokenAmount = await new TokenAmount(uniPair.liquidityToken, total)
            const token0Amount = await new TokenAmount(uniPair?.[token0Ref?.current?.name], BigInt(Math.round(token0Input * (10 ** token0?.token?.decimals))))
            const token1Amount = await new TokenAmount(uniPair?.[token1Ref?.current?.name], BigInt(Math.round(token1Input * (10 ** token1?.token?.decimals))))
            const uniswapTokensMinted = uniPair?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount).toFixed(uniPair.liquidityToken.decimals)
            const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(uniPair.liquidityToken.decimals)

            return {uniswapTokensMinted, percentageOfPool, total: formatUnits(BigNumber.from(total._hex))}
        }
    }


    const [liquidityInfo, setLiquidityInfo] = useState({})
    const [maxError, setMaxError] = useState("")
    const setMax = async (clickedToken, clickedTokenRef) => {
        const clickedTokenName = clickedTokenRef?.current?.name
        const clickedTokenMax = clickedTokenRef?.current?.max
        const clickedTokenBalance = Number((clickedToken?.balance / 10 ** clickedToken?.token?.decimals))
        const pairToken = clickedTokenName === "token0" ? lpToken1 : lpToken0
        const pairTokenRef = clickedTokenName === "token0" ? token1InputRef : token0InputRef
        const pairTokenName = pairTokenRef?.current?.name
        const route = new Route([globalPair], selectedTokens[clickedTokenName])
        const midPrice = route.midPrice.toSignificant(6)


        if (clickedToken?.fiatBalance > pairToken?.fiatBalance) {
            setMaxError(`insufficient ${pairToken?.token?.symbol} balance`)
            setState(state => ({...state, [clickedTokenName]: NaN}))
            setState(state => ({...state, [pairTokenName]: NaN}))
            setLiquidityInfo({})
        } else {
            const pairTokenInput = clickedTokenBalance * midPrice
            setState(state => ({...state, [clickedTokenName]: clickedTokenMax}))
            setState(state => ({...state, [pairTokenName]: pairTokenInput}))
            setMaxError("")

            const liquidityInfo = await getLiquidityTokenInfo({
                uniPair: globalPair,
                token0: clickedToken,
                token0Ref: clickedTokenRef,
                token0Input: clickedTokenMax,
                token1: pairToken,
                token1Ref: pairTokenRef,
                token1Input: pairTokenInput
            })
            setLiquidityInfo(liquidityInfo)
        }
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
                            onChange={(e) => handleSetValue(e, lpToken0, token0InputRef)}
                            className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
                            id="name"
                            name="token0"
                            type="number"
                            step={0.000001}
                            placeholder="0.0"
                            required
                            max={lpToken0?.balance / 10 ** lpToken0?.token?.decimals}
                            ref={token0InputRef}
                            disabled={!globalPair}
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
                    <div
                        className={`mr-3 flex cursor-pointer justify-end text-[#FC8D4D] ${!globalPair ? 'pointer-events-none' : ''}`}
                        onClick={() => setMax(lpToken0, token0InputRef)}
                    >
                        max
                    </div>
                </div>

                <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex flex-row">
                        <input
                            value={state?.token1}
                            onChange={(e) => handleSetValue(e, lpToken1, token1InputRef)}
                            className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
                            id="name"
                            name="token1"
                            type="number"
                            step={0.000001}
                            placeholder="0.0"
                            required
                            max={lpToken1?.balance / 10 ** lpToken1?.token?.decimals}
                            ref={token1InputRef}
                            disabled={!globalPair}
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
                        className={`mr-3 flex cursor-pointer justify-end text-[#FC8D4D] ${!globalPair ? 'pointer-events-none' : ''}`}
                        onClick={() => setMax(lpToken1, token1InputRef)}
                    >
                        max
                    </div>
                </div>

                {/* Price and pool share */}
                {(maxError.length > 0 && (
                    <div>
                        {maxError}
                    </div>
                ) || (
                    <div className="mb-8 w-full">
                        <div>
                            <div>Uniswap Tokens to be received: {liquidityInfo?.uniswapTokensMinted}</div>
                            {!!liquidityInfo?.percentageOfPool && (
                                <div>Percentage of Liquidity Pool: {eToNumber(liquidityInfo?.percentageOfPool)}</div>
                            )}

                            <div>Total Liquidity Tokens in pool: {liquidityInfo?.total}</div>

                        </div>
                        <button
                            className="focus:shadow-outline h-16 w-full appearance-none rounded-lg border bg-slate-100 py-2 px-3 text-xl leading-tight shadow focus:outline-none dark:bg-slate-800"
                            type="submit"
                        >
                            submit
                        </button>
                    </div>
                ))}
            </form>
        </Modal>
    )
}

export default UniswapLpModal
