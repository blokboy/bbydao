import React from "react"
import { useDaoStore } from "stores/useDaoStore"
import { useSigner } from "wagmi"
import { ChainId, Fetcher, Route, Token } from "@uniswap/sdk"
import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json"
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { BigNumber, ethers } from "ethers"
import Modal from "components/Layout/Modal"
import useForm from "hooks/useForm"
import { amount, getLiquidityPairInfo, handleGnosisTransaction, readableTokenBalance } from "./helpers"
import PoolInfo from "./PoolInfo"
import TokenInput from "./TokenInput"

const UniswapLpModal = ({ safeAddress, tokenLogos }) => {
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [{ data: signer }] = useSigner()
  const setUniswapLpModalOpen = useDaoStore(state => state.setUniswapLpModalOpen)
  const lpToken0 = useDaoStore(state => state.lpToken0)
  const lpToken1 = useDaoStore(state => state.lpToken1)
  const setLpToken1 = useDaoStore(state => state.setLpToken1)
  const setLpToken0 = useDaoStore(state => state.setLpToken0)
  const { state, setState } = useForm()
  const token0InputRef = React.useRef()
  const token1InputRef = React.useRef()
  const [pair, setPair] = React.useState()
  const [liquidityInfo, setLiquidityInfo] = React.useState({})
  const [maxError, setMaxError] = React.useState("")
  const [hasAllowance, setHasAllowance] = React.useState()
  const token0Logo = tokenLogos.filter(logo => logo.symbol === lpToken0?.token?.symbol)[0]?.uri
  const token1Logo = tokenLogos.filter(logo => logo.symbol === lpToken1?.token?.symbol)[0]?.uri
  const supplyDisabled =
    !signer || maxError.length > 0 || !hasAllowance?.token0 || !hasAllowance?.token1 || !hasAllowance?.pair
  const closeUniswapLpModal = () => {
    setLpToken0({})
    setLpToken1({})
    setUniswapLpModalOpen()
    setMaxError("")
  }

  /*  Construct object of selected tokens represented as Uniswap Token Objects */
  const uniswapTokens = React.useMemo(() => {
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

    return { [lpToken0?.token?.symbol]: token0, [lpToken1?.token?.symbol]: token1 }
  }, [lpToken0, lpToken1])

  /* Propose and Execute uniswapV2Router02 - addLiquidity   */
  const handleSubmit = async (e, liquidityInfo) => {
    e.preventDefault()

    const uniswapV2RouterContract02 = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02["abi"], signer)
    const pairHasEth = liquidityInfo.transactionInfo.filter(token => token.token.symbol === "ETH")
    const slippage = 0.25 // default 5.5% slippage

    /* token A */
    const tokenA = liquidityInfo.transactionInfo[0].token.address
    const tokenADecimals = liquidityInfo.transactionInfo[0].token.decimals
    const tokenAAmount = liquidityInfo.transactionInfo[0].amount
    const amountADesired = amount(tokenAAmount, tokenADecimals) // wondering if this is correct
    const amountAMin = amount(tokenAAmount - tokenAAmount * slippage, tokenADecimals)

    /* token B */
    const tokenB = liquidityInfo.transactionInfo[1].token.address
    const tokenBDecimals = liquidityInfo.transactionInfo[1].token.decimals
    const tokenBAmount = liquidityInfo.transactionInfo[1].amount
    const amountBDesired = amount(tokenBAmount, tokenBDecimals)
    const amountBMin = amount(tokenBAmount - tokenBAmount * slippage, tokenBDecimals)

    /* addLiquidity or addLiquidityEth  */
    if (pairHasEth.length === 0) {
      handleGnosisTransaction({
        contract: {
          abi: IUniswapV2Router02["abi"],
          instance: uniswapV2RouterContract02,
          fn: "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)",
          args: {
            tokenA: ethers.utils.getAddress(tokenA),
            tokenB: ethers.utils.getAddress(tokenB),
            amountADesired: BigNumber.from(amountADesired),
            amountBDesired: BigNumber.from(amountBDesired),
            amountAMin: BigNumber.from(amountAMin),
            amountBMin: BigNumber.from(amountBMin),
            addressTo: ethers.utils.getAddress(safeAddress),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          },
        },
        signer,
        safeAddress,
        to: UniswapV2Router02,
        value: 0,
      })
    } else {
      const WETH = await uniswapV2RouterContract02?.WETH()
      handleGnosisTransaction({
        contract: {
          abi: IUniswapV2Router02["abi"],
          instance: uniswapV2RouterContract02,
          fn: "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
          args: {
            token: ethers.utils.getAddress(pair?.liquidityToken?.address),
            amountTokenDesired: tokenA === WETH ? BigNumber.from(amountBDesired) : BigNumber.from(amountADesired),
            amountTokenMin: tokenA === WETH ? BigNumber.from(amountBMin) : BigNumber.from(amountAMin),
            amountETHMin: tokenA === WETH ? BigNumber.from(amountAMin) : BigNumber.from(amountBMin),
            addressTo: ethers.utils.getAddress(safeAddress),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          },
        },
        signer,
        safeAddress,
        to: UniswapV2Router02,
        value: tokenA === WETH ? BigNumber.from(amountADesired) : BigNumber.from(amountBDesired),
      })
    }
  }

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
    const token1Input = Number(token0Input * midPrice)
    const pairToken = lpToken0.token.symbol === token.token.symbol ? lpToken1 : lpToken0

    /*  If User attempts to LP more than balance, default to max balance */
    if (token0Input > max) {
      handleSetMaxTokenValue(token, tokenRef)
    } else {
      setState(state => ({ ...state, [token.token.symbol]: token0Input }))
      setState(state => ({ ...state, [token1?.symbol]: token1Input }))
      setMaxError("")

      if (!isNaN(token0Input) && !isNaN(token1Input) && token0Input > 0 && token1Input > 0) {
        const liquidityInfo = await getLiquidityPairInfo({
          pair: pair,
          token0: token0,
          token0Input: token0Input,
          token0ETHConversion: token.ethValue,
          token1: token1,
          token1Input: token1Input,
          token1ETHConversion: pairToken.ethValue,
          abi: IUniswapV2ERC20.abi,
        })
        setLiquidityInfo(liquidityInfo)
      }
    }
  }

  /* Handle setting max token values and retrieving liquidity pair information  */
  const handleSetMaxTokenValue = async (token, tokenRef) => {
    const token0 = uniswapTokens[token.token.symbol]
    const token0Input = tokenRef?.current?.max
    const pairToken = lpToken0.token.symbol === token.token.symbol ? lpToken1 : lpToken0

    const route = new Route([pair], uniswapTokens[token.token.symbol])
    const midPrice = route.midPrice.toSignificant(6)
    const invertMidPrice = route.midPrice.invert().toSignificant(6)
    const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.token.symbol)[0][1]
    const token1Input = token0Input * midPrice

    if (parseInt(token?.fiatBalance) > parseInt(pairToken?.fiatBalance)) {
      setMaxError(`Insufficient ${pairToken?.token?.symbol} balance`)
      setState(state => ({ ...state, [token.token.symbol]: 0 }))
      setState(state => ({ ...state, [token1.symbol]: 0 }))
      setLiquidityInfo({})
    } else {
      setState(state => ({ ...state, [token.token.symbol]: token0Input }))
      setState(state => ({ ...state, [token1.symbol]: token1Input }))
      setMaxError("")

      const liquidityInfo = await getLiquidityPairInfo({
        pair: pair,
        token0: token0,
        token0Input: token0Input,
        token0ETHConversion: token.ethValue,
        token1: token1,
        token1Input: token1Input,
        token1ETHConversion: pairToken.ethValue,
        abi: IUniswapV2ERC20.abi,
      })
      setLiquidityInfo(liquidityInfo)
    }
  }

  /* Initialize state of inputs and initialize Uniswap Pair */
  const init = async () => {
    setState(state => ({ ...state, [lpToken0.token.symbol]: 0 }))
    setState(state => ({ ...state, [lpToken1.token.symbol]: 0 }))
    const uniPair = await Fetcher.fetchPairData(
      uniswapTokens[lpToken0.token.symbol],
      uniswapTokens[lpToken1.token.symbol]
    )
    await setPair(uniPair)
  }
  React.useEffect(() => {
    init()
  }, [])

  return (
    <Modal close={closeUniswapLpModal} heading={"Add Liquidity"}>
      <div className="mt-2 rounded-xl bg-[#eda67e24] p-4 font-thin text-[#FC8D4D]">
        <span className="font-bold">Tip:</span> When you add liquidity, you will receive pool tokens representing your
        position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at
        any time.
      </div>
      <form className="flex w-full flex-col space-y-8 py-4" onSubmit={e => handleSubmit(e, liquidityInfo)}>
        <TokenInput
          pair={pair}
          token1InputRef={token0InputRef}
          lpToken={lpToken0}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          readableTokenBalance={readableTokenBalance}
          state={state}
          logo={token0Logo}
        />
        <TokenInput
          pair={pair}
          token1InputRef={token1InputRef}
          lpToken={lpToken1}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          readableTokenBalance={readableTokenBalance}
          state={state}
          logo={token1Logo}
        />
        <div className="mb-8 w-full">
          {liquidityInfo && (
            <PoolInfo
              spender={UniswapV2Router02}
              pair={pair?.liquidityToken}
              info={liquidityInfo}
              signer={signer}
              hasAllowance={hasAllowance}
              setHasAllowance={setHasAllowance}
              safeAddress={safeAddress}
            />
          )}
          {state[lpToken0?.token?.symbol] > 0 && state[lpToken1?.token?.symbol] > 0 && (
            <button
              className={`h-16 w-full appearance-none rounded-full border ${
                supplyDisabled ? "bg-slate-200" : "bg-[#FC8D4D] dark:hover:bg-[#10172a]"
              } focus:shadow-outline mt-4 border py-2 px-3 text-xl leading-tight focus:outline-none ${
                supplyDisabled ? "border-slate-300" : "border-[#e1793d] hover:bg-[#e1793d] dark:border-[#10172a]"
              } dark:bg-slate-800`}
              type="submit"
              disabled={supplyDisabled}
            >
              <div className={`${supplyDisabled ? "text-[#b9b9b9]" : "text-white"}`}>
                {maxError.length > 0 ? maxError : supplyDisabled ? "Token Approval Needed" : "Supply"}
              </div>
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default UniswapLpModal
