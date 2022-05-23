import { ChainId, Fetcher, Route, Token, TokenAmount } from "@uniswap/sdk"
import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json"
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { BigNumber, ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import useForm from "hooks/useForm"
import React, { useState } from "react"
import { useQueryClient } from "react-query"
import { flatten } from "utils/helpers"
import { useLayoutStore } from "stores/useLayoutStore"
import { amount } from "./helpers"
import PoolInfo from "./PoolInfo"
import TokenInput from "./TokenInput"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import useCalculateFee from "hooks/useCalculateFee"

const UniswapLpModal = ({ lpToken0, token1 = null }) => {
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { state, setState, handleChange } = useForm()
  const token0InputRef = React.useRef()
  const token1InputRef = React.useRef()
  const [pair, setPair] = React.useState()
  const [liquidityInfo, setLiquidityInfo] = React.useState({})
  const [maxError, setMaxError] = React.useState("")
  const [hasAllowance, setHasAllowance] = React.useState()
  const [openSearch, setOpenSearch] = React.useState(false)
  const queryClient = useQueryClient()
  const safeAddress = React.useMemo(() => {
    return queryClient.getQueryData("expandedDao")
  }, [queryClient])
  const signer = useLayoutStore(state => state.signer)


  const treasury = React.useMemo(() => {
    if (!safeAddress) {
      return
    }

    return queryClient.getQueryData(["daoTokens", safeAddress])
  }, [safeAddress])
  const [lpToken1, setLpToken1] = useState(token1)
  const tokenLogos = React.useMemo(() => {
    if (!treasury) {
      return
    }

    return treasury?.reduce((acc = [], cv) => {
      const uri = cv?.token?.logoUri
      const symbol = cv?.token?.symbol
      const isETH = parseInt(cv?.ethValue) === 1 && cv?.token === null && cv?.tokenAddress === null
      uri && symbol
        ? acc.push({ uri, symbol })
        : isETH
        ? acc.push({ uri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png", symbol: "ETH" })
        : null
      return acc
    }, [])
  }, [treasury])
  const token0Logo = React.useMemo(() => {
    if (!!tokenLogos) {
      return tokenLogos.filter(logo => logo.symbol === lpToken0.symbol)[0]?.uri
    }
  }, [tokenLogos, lpToken0])
  const token1Logo = React.useMemo(() => {
    if (!!tokenLogos) {
      return tokenLogos.filter(logo => logo.symbol === lpToken1?.symbol)[0]?.uri
    }
  }, [tokenLogos, lpToken1])
  const tokenSymbols = React.useMemo(() => {
    if (!treasury) {
      return
    }

    return treasury?.reduce((acc = [], cv) => {
      if (parseFloat(cv?.ethValue) === 1 && cv?.token === null && cv?.tokenAddress === null) {
        const eth = {
          ...cv,
          token: {
            decimals: 18,
            logoUri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
            name: "Ether",
            symbol: "ETH",
          },
          address: WETH,
          tokenAddress: WETH,
        }
        if (acc.filter(item => item.symbol === flatten(eth).symbol).length < 1)
          acc.push({
            symbol: flatten(eth).symbol,
            uri: flatten(eth).logoUri,
            decimals: flatten(eth).decimals,
            name: flatten(eth).name,
            balance: flatten(eth).balance,
            ...flatten(eth),
          })
      } else {
        if (acc.filter(item => item.symbol === cv.symbol).length < 1) {
          acc.push({
            symbol: flatten(cv).symbol,
            uri: flatten(cv).logoUri,
            decimals: flatten(cv).decimals,
            name: flatten(cv).name,
            balance: flatten(cv).balance,
            ...flatten(cv),
          })
        }
      }

      return acc
    }, [])
  }, [treasury])
  const filteredTokensBySymbol = React.useMemo(() => {
    if (!tokenSymbols) {
      return
    }

    return tokenSymbols?.reduce((acc = [], cv) => {
      if (!state?.symbol) {
        if (
          acc.filter(item => item.symbol === cv.symbol).length === 0 &&
          cv.symbol !== lpToken0?.symbol &&
          cv.symbol !== "UNI-V2" &&
          parseFloat(cv.fiatBalance) > 0
        ) {
          acc.push(cv)
        }
      } else {
        if (
          cv?.symbol?.toUpperCase().includes(state?.symbol?.toUpperCase()) &&
          cv.symbol !== lpToken0?.symbol &&
          cv.symbol !== "UNI-V2" &&
          parseFloat(cv.fiatBalance) > 0
        ) {
          acc.push(cv)
        }
      }
      return acc
    }, [])
  }, [state.symbol])
  const supplyDisabled = React.useMemo(() => {
    return !signer || maxError.length > 0 || !hasAllowance?.token0 || !hasAllowance?.token1 || !hasAllowance?.pair
  }, [signer, maxError, hasAllowance])

  const { gnosisTransaction } = useGnosisTransaction(safeAddress)
  const { calculateFee } = useCalculateFee()

  /*  Construct object of selected tokens represented as Uniswap Token Objects */
  const uniswapTokens = React.useMemo(() => {
    if (!lpToken0 || !lpToken1 || !ChainId) {
      return
    }

    const tokenA = new Token(
      ChainId.MAINNET,
      lpToken0?.tokenAddress || lpToken0?.address, //clean this up
      lpToken0?.decimals,
      lpToken0?.symbol,
      lpToken0?.name
    )

    const tokenB = new Token(
      ChainId.MAINNET,
      flatten(lpToken1)?.tokenAddress,
      flatten(lpToken1)?.decimals,
      flatten(lpToken1)?.symbol,
      flatten(lpToken1)?.name
    )

    return { [lpToken0?.symbol]: tokenA, [lpToken1?.symbol]: tokenB }
  }, [lpToken0, lpToken1, ChainId])

  /* Handle interaction with Uniswap to get LP information  */
  const getLiquidityPairInfo = async ({
    pair,
    token0,
    token0Input,
    token0ETHConversion,
    token1,
    token1Input,
    token1ETHConversion,
    abi,
  }) => {
    try {
      if (!!pair && !!signer) {
        /* Get Total Supply of LP pair on-chain  */
        const contract = new ethers.Contract(pair.liquidityToken.address, abi, signer)
        const total = await contract.totalSupply()
        const totalTokenAmount = await new TokenAmount(pair.liquidityToken, total)
        const token0Amount = await new TokenAmount(token0, amount(token0Input, token0?.decimals))
        const token0AmountInEth = (token0Input * token0ETHConversion).toFixed(token0?.decimals).toString()
        const token1Amount = await new TokenAmount(token1, amount(token1Input, token1?.decimals))
        const token1AmountInEth = (token1Input * token1ETHConversion).toFixed(token1?.decimals).toString()
        const uniswapTokensMinted = pair
          ?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount)
          .toFixed(pair.liquidityToken.decimals)
        const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(pair.liquidityToken.decimals)
        const uniswapPairURI = `https://v2.info.uniswap.org/pair/${pair.liquidityToken.address}`
        const etherscanURI = `https://etherscan.io/address/${pair.liquidityToken.address}`
        const transactionInfo = [
          {
            token: token0,
            amount: Number(token0Input),
            amountInWei: ethers.utils.parseEther(token0AmountInEth),
          },
          {
            token: token1,
            amount: Number(token1Input),
            amountInWei: ethers.utils.parseEther(token1AmountInEth),
          },
        ]

        return {
          percentageOfPool,
          total: formatUnits(BigNumber.from(total._hex)),
          transactionInfo,
          uniswapTokensMinted,
          uris: {
            uniswap: uniswapPairURI,
            etherscan: etherscanURI,
          },
        }
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  /* Propose and Execute uniswapV2Router02 - addLiquidity   */
  const handleSubmit = async (e, liquidityInfo) => {
    try {
      e.preventDefault()

      const uniswapV2RouterContract02 = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02["abi"], signer)
      const pairHasEth = liquidityInfo.transactionInfo.filter(token => flatten(token)?.symbol === "ETH")
      const slippage = 0.055 // default 5.5% slippage

      const token0 = flatten(liquidityInfo.transactionInfo[0])
      const token1 = flatten(liquidityInfo.transactionInfo[1])

      /* token A */
      const tokenA = token0?.address
      const tokenADecimals = token0?.decimals
      const tokenAAmount = token0?.amount
      const amountADesired = amount(tokenAAmount, tokenADecimals) // wondering if this is correct
      const amountAMin = amount(tokenAAmount - tokenAAmount * slippage, tokenADecimals)

      /* token B */
      const tokenB = token1?.address
      const tokenBDecimals = token1?.decimals
      const tokenBAmount = token1?.amount
      const amountBDesired = amount(tokenBAmount, tokenBDecimals)
      const amountBMin = amount(tokenBAmount - tokenBAmount * slippage, tokenBDecimals)

      /* addLiquidity or addLiquidityEth  */
      if (pairHasEth.length === 0) {
        gnosisTransaction(
          {
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
          UniswapV2Router02,
          0,
          await calculateFee([
            { value: BigNumber.from(amountADesired), token: token0 },
            { value: BigNumber.from(amountBDesired), token: token1 },
          ])
        )
      } else {
        const WETH = await uniswapV2RouterContract02?.WETH()
        gnosisTransaction(
          {
            abi: IUniswapV2Router02["abi"],
            instance: uniswapV2RouterContract02,
            fn: "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
            args: {
              token: ethers.utils.getAddress(tokenA === WETH ? tokenB : tokenA),
              amountTokenDesired: tokenA === WETH ? BigNumber.from(amountBDesired) : BigNumber.from(amountADesired),
              amountTokenMin: tokenA === WETH ? BigNumber.from(amountBMin) : BigNumber.from(amountAMin),
              amountETHMin: tokenA === WETH ? BigNumber.from(amountAMin) : BigNumber.from(amountBMin),
              addressTo: ethers.utils.getAddress(safeAddress),
              deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            },
          },
          UniswapV2Router02,
          tokenA === WETH ? BigNumber.from(amountADesired) : BigNumber.from(amountBDesired),
          await calculateFee([
            { value: BigNumber.from(amountADesired), token: token0 },
            { value: BigNumber.from(amountBDesired), token: token1 },
          ])
        )
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  /* Handle setting token values and retrieving liquidity pair information  */
  const handleSetTokenValue = async (e, token, tokenRef) => {
    try {
      const bal = token?.balance
      const dec = token?.decimals
      const max = bal / 10 ** dec
      const token0 = Object.entries(uniswapTokens).filter(item => item[0] === token?.symbol)[0][1]
      const token0Input = e?.target?.valueAsNumber
      const route = new Route([pair], uniswapTokens[token?.symbol])
      const midPrice = route.midPrice.toSignificant(6)
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token?.symbol)[0][1]
      const token1Input = Number(token0Input * midPrice)
      const pairToken = lpToken0?.symbol === token?.symbol ? lpToken1 : lpToken0

      /*  If User attempts to LP more than balance, default to max balance */
      if (token0Input > max) {
        handleSetMaxTokenValue(token, tokenRef)
      } else {
        setState(state => ({ ...state, [token?.symbol]: token0Input }))
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
    } catch (err) {
      console.log("err", err)
    }
  }

  /* Handle setting max token values and retrieving liquidity pair information  */
  const handleSetMaxTokenValue = async (token, tokenRef) => {
    try {
      const token0 = uniswapTokens[token?.symbol]
      const token0Input = tokenRef?.current?.max
      const pairToken = lpToken0?.symbol === token?.symbol ? lpToken1 : lpToken0
      const route = new Route([pair], uniswapTokens[token?.symbol])
      const midPrice = route.midPrice.toSignificant(6)
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token?.symbol)[0][1]
      const token1Input = token0Input * midPrice

      if (parseFloat(token?.fiatBalance) > parseFloat(pairToken?.fiatBalance)) {
        setMaxError(`Insufficient ${pairToken?.symbol} balance`)
        setState(state => ({ ...state, [token?.symbol]: 0 }))
        setState(state => ({ ...state, [token1.symbol]: 0 }))
        setLiquidityInfo({})
      } else {
        setState(state => ({ ...state, [token?.symbol]: token0Input }))
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
    } catch (err) {
      console.log("err", err)
    }
  }

  /* Once both LP tokens are set and uniswap Token objects have been created, get pairData  */
  React.useMemo(async () => {
    try {
      if (!!lpToken0 && !!lpToken1 && !!uniswapTokens) {
        setState(state => ({ ...state, [lpToken1?.symbol]: 0 }))
        const uniPair = await Fetcher.fetchPairData(
          uniswapTokens[flatten(lpToken0)?.symbol],
          uniswapTokens[lpToken1?.symbol]
        )
        await setPair(uniPair)
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [uniswapTokens, lpToken0, lpToken1])

  /* set pair token and close search  */
  const handlePickToken = React.useCallback(token => {
    setLpToken1(token)
    setOpenSearch(false)
  }, [])

  /* Initialize state of inputs and initialize Uniswap Pair */
  const init = async () => {
    try {
      setState(state => ({ ...state, [lpToken0?.symbol]: 0 }))
    } catch (err) {
      console.log("err", err)
    }
  }
  React.useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className="mt-2 rounded-xl bg-[#eda67e24] p-4 font-thin text-[#FC8D4D]">
        <span className="font-bold">Tip:</span> When you add liquidity, you will receive pool tokens representing your
        position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at
        any time.
      </div>
      <form className="flex w-full flex-col space-y-8 py-4" onSubmit={e => handleSubmit(e, liquidityInfo)}>
        <TokenInput
          tokens={{ token0: lpToken0, token1: lpToken1 }}
          pair={pair}
          tokenInputRef={token0InputRef}
          lpToken={lpToken0}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          state={state}
          logo={token0Logo}
        />
        <TokenInput
          tokens={{ token0: lpToken0, token1: lpToken1 }}
          pair={pair}
          tokenInputRef={token1InputRef}
          lpToken={lpToken1}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          state={state}
          logo={token1Logo}
          setOpenSearch={setOpenSearch}
        />
        {openSearch && (
          <input
            id="symbol"
            name="symbol"
            onChange={handleChange}
            value={state?.symbol || ""}
            className="mt-8 h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-3xl leading-tight focus:outline-none dark:bg-slate-800"
            placeholder={"Type to search"}
            autoComplete="off"
            autoFocus={true}
          />
        )}
        {openSearch && filteredTokensBySymbol && filteredTokensBySymbol?.length > 0 && (
          <div className="mt-4 flex max-h-96 flex-wrap gap-1 overflow-y-scroll rounded-lg bg-slate-100 p-4 pt-4 shadow-xl dark:bg-slate-800">
            {filteredTokensBySymbol.map((token, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePickToken(token)}
                className="mb-2 inline-flex self-start rounded-full bg-slate-300 p-2 px-4 font-light dark:bg-slate-600 hover:dark:bg-slate-700"
              >
                <div className="flex items-center justify-center">
                  <div className="mr-2">{token?.symbol?.toUpperCase()}</div>
                  <div className="flex h-6 w-6 overflow-hidden rounded-full">
                    <img src={token?.uri} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
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
          {parseFloat(state[lpToken0?.symbol]) > 0 && parseFloat(state[lpToken1?.symbol]) > 0 && (
            <button
              className={`focus:shadow-outline mt-4 h-16 w-full appearance-none rounded-full 
              bg-sky-500 py-2 px-3 text-xl leading-tight hover:bg-sky-600 focus:outline-none ${
                supplyDisabled ? "border-slate-300" : "dark:bg-orange-600 hover:dark:bg-orange-700"
              }`}
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
    </>
  )
}

export default UniswapLpModal
