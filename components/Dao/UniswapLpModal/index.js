import {ChainId, Fetcher, Route, Token, TokenAmount} from "@uniswap/sdk"
import IUniswapV2ERC20                               from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import Modal                                         from "components/Layout/Modal"
import {BigNumber, ethers}                           from 'ethers'
import {formatUnits}                                 from 'ethers/lib/utils'
import useForm                                       from "hooks/useForm"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {useDaoStore}                                 from "stores/useDaoStore"
import LPInfo                                        from './LpInfo'
import TokenInput                                    from './TokenInput'


const UniswapLpModal = ({safeAddress}) => {
    const setUniswapLpModalOpen = useDaoStore(state => state.setUniswapLpModalOpen)
    const lpToken0 = useDaoStore(state => state.lpToken0)
    const lpToken1 = useDaoStore(state => state.lpToken1)
    const setLpToken1 = useDaoStore(state => state.setLpToken1)
    const setLpToken0 = useDaoStore(state => state.setLpToken0)
    const {state, setState, handleChange} = useForm()
    const token0InputRef = useRef()
    const token1InputRef = useRef()
    const [pair, setPair] = useState()
    const [liquidityInfo, setLiquidityInfo] = useState({})
    const [maxError, setMaxError] = useState("")

    // Close function provided to <Modal /> component
    const closeUniswapLpModal = e => {
        setLpToken0({})
        setLpToken1({})
        setUniswapLpModalOpen()
        setMaxError("")
    }

    const handleSubmit = async (e, liquidityInfo) => {
        e.preventDefault()


        // if either token was WETH
        //     function addLiquidityETH(
        //         address token,
        //         uint amountTokenDesired,
        //         uint amountTokenMin,
        //         uint amountETHMin,
        //         address to,
        //         uint deadline
        // ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
        /// else
        //  function addLiquidity(
        //   address tokenA,
        //   address tokenB,
        //   uint amountADesired,
        //   uint amountBDesired,
        //   uint amountAMin,
        //   uint amountBMin,
        //   address to,
        //   uint deadline
        // ) external returns (uint amountA, uint amountB, uint liquidity);
        ///https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#addliquidity

        console.log('e', e)
        console.log('liquidityInfo', liquidityInfo)
    }


    /* Get Total Supply of LP pair on-chain  */
    const totalPairSupply = async (pair) => {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(pair.liquidityToken.address, IUniswapV2ERC20.abi, provider)
        return await contract.totalSupply()
    }
    /* Human Readable Token Balance  */
    const readableTokenBalance = (token) => {
        return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
    }

    /*  Construct object of selected tokens represented as Uniswap Token Objects */
    const uniswapTokens = useMemo(() => {
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

        return {[lpToken0?.token?.symbol]: token0, [lpToken1?.token?.symbol]: token1}

    }, [lpToken0, lpToken1])
    /* Handle setting token values and retrieving liquidity pair information  */
    const handleSetTokenValue = async (e, token, tokenRef) => {
        const bal = token?.balance
        const dec = token?.token?.decimals
        const max = bal / 10 ** dec
        const token0 = Object.entries(uniswapTokens).filter(item => item[0] === token.token.symbol)[0][1]
        const token0Input = e?.target?.valueAsNumber
        const route = new Route([pair], uniswapTokens[token.token.symbol])
        const midPrice = route.midPrice.toSignificant(6)
        const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.token.symbol)[0][1]
        const token1Input = Number((token0Input * midPrice))

        if (token0Input > max) {
            handleSetMaxTokenValue(token, tokenRef)
        } else {
            setState(state => ({...state, [token.token.symbol]: token0Input}))
            setState(state => ({...state, [token1?.symbol]: token1Input}))
            setMaxError("")

            if (!isNaN(token0Input) && !isNaN(token1Input) && token0Input > 0 && token1Input > 0) {
                const liquidityInfo = await getLiquidityPairInfo({
                    pair: pair,
                    token0: token0,
                    token0Input: token0Input.toFixed(10),
                    token1: token1,
                    token1Input: token1Input.toFixed(10)
                })
                setLiquidityInfo(liquidityInfo)
            }
        }
    }
    const handleSetMaxTokenValue = async (token, tokenRef) => {
        const token0 = uniswapTokens[token.token.symbol]
        const token0Input = tokenRef?.current?.max
        const pairToken = lpToken0.token.symbol === token.token.symbol ? lpToken1 : lpToken0

        const route = new Route([pair], uniswapTokens[token.token.symbol])
        const midPrice = route.midPrice.toSignificant(6)

        const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.token.symbol)[0][1]
        const token1Input = token0Input * midPrice

        if (token?.fiatBalance > pairToken?.fiatBalance) {
            setMaxError(`insufficient ${pairToken?.token?.symbol} balance`)
            setState(state => ({...state, [token.token.symbol]: 0}))
            setState(state => ({...state, [token1.symbol]: 0}))
            setLiquidityInfo({})
        } else {
            setState(state => ({...state, [token.token.symbol]: token0Input}))
            setState(state => ({...state, [token1.symbol]: token1Input}))
            setMaxError("")

            const liquidityInfo = await getLiquidityPairInfo({
                pair: pair,
                token0: token0,
                token0Input: token0Input,
                token1: token1,
                token1Input: token1Input
            })
            setLiquidityInfo(liquidityInfo)
        }
    }
    const getLiquidityPairInfo = async ({pair, token0, token0Input, token1, token1Input}) => {
        if (!!pair) {
            const total = await totalPairSupply(pair)
            const totalTokenAmount = await new TokenAmount(pair.liquidityToken, total)
            const token0Amount = await new TokenAmount(token0, BigInt(Math.round(token0Input * (10 ** token0?.decimals))))
            const token1Amount = await new TokenAmount(token1, BigInt(Math.round(token1Input * (10 ** token1?.decimals))))
            const uniswapTokensMinted = pair?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount).toFixed(pair.liquidityToken.decimals)
            const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(pair.liquidityToken.decimals)

            return {uniswapTokensMinted, percentageOfPool, total: formatUnits(BigNumber.from(total._hex))}
        }
    }

    const init = async () => {
        setState(state => ({...state, [lpToken0.token.symbol]: 0}))
        setState(state => ({...state, [lpToken1.token.symbol]: 0}))
        const uniPair = await Fetcher.fetchPairData(uniswapTokens[lpToken0.token.symbol], uniswapTokens[lpToken1.token.symbol])
        await setPair(uniPair)
    }

    useEffect(() => {
        init()

    }, [])

    return (
        <Modal close={closeUniswapLpModal} heading={"Uniswap LP"}>
            <form
                className="flex w-full flex-col space-y-8 py-4"
                onSubmit={(e) => handleSubmit(e, liquidityInfo)}
            >
                <TokenInput
                    pair={pair}
                    token1InputRef={token0InputRef}
                    lpToken={lpToken0}
                    handleSetTokenValue={handleSetTokenValue}
                    handleSetMaxTokenValue={handleSetMaxTokenValue}
                    readableTokenBalance={readableTokenBalance}
                    state={state}
                />
                <TokenInput
                    pair={pair}
                    token1InputRef={token1InputRef}
                    lpToken={lpToken1}
                    handleSetTokenValue={handleSetTokenValue}
                    handleSetMaxTokenValue={handleSetMaxTokenValue}
                    readableTokenBalance={readableTokenBalance}
                    state={state}
                />
                {/* Price and pool share */}
                {(maxError.length > 0 && (
                    <div>
                        {maxError}
                    </div>
                ) || (
                    <div className="mb-8 w-full">
                        <LPInfo info={liquidityInfo}/>
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
