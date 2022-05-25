import { ChainId, Fetcher, Percent, Route, Token } from "@uniswap/sdk"
import defaultTokens from "@uniswap/default-token-list"
import axios from "axios"
import { BigNumber, ethers } from "ethers"
import React from "react"
import useForm from "hooks/useForm"
import { HiOutlineSwitchVertical, HiArrowSmDown } from "react-icons/hi"
import { useQueryClient } from "react-query"
import { max256, NumberFromBig } from "utils/helpers"
import { minimalABI } from "hooks/useERC20Contract"
import useCalculateFee from "hooks/useCalculateFee"
import { useLayoutStore } from "stores/useLayoutStore"
import { usePlaygroundStore } from "stores/usePlaygroundStore"
import TokenInput from "../TokenInput"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import IUniswapV2Pair from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import WETHABI from "ABIs/WETH.json"
import Slippage from "../Slippage"
import TokenSearch from "../TokenSearch"

const Swap = ({ token }) => {
  const queryClient = useQueryClient()
  const token0InputRef = React.useRef()
  const token1InputRef = React.useRef()
  const [openSearch, setOpenSearch] = React.useState(false)
  const [poolExists, setPoolExists] = React.useState(true)
  const [hasNoLiquidity, setHasNoLiquidity] = React.useState(false)
  const [isEthOnEth, setIsEthOnEth] = React.useState(false)
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const signer = useLayoutStore(state => state.signer)
  const bbyDaoTokens = queryClient.getQueryData(["daoTokens", bbyDao])
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const [hasAllowance, setHasAllowance] = React.useState()
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const USDT = ethers.utils.getAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7")

  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { state, setState, handleChange } = useForm()
  const { calculateFee } = useCalculateFee()

  /* Build Token List */
  const [coingeckoTokenList, setCoingeckoTokenList] = React.useState([])
  React.useMemo(async () => {
    try {
      const res = await axios.get("https://tokens.coingecko.com/uniswap/all.json")
      setCoingeckoTokenList(res.data.tokens)
      return res.data.tokens
    } catch (err) {
      console.log("err", err)
    }
  }, [])

  const defaultEth = {
    address: WETH,
    chainId: ChainId.MAINNET,
    decimals: 18,
    logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
    name: "Ether",
    symbol: "ETH",
  }
  const defaultTokenList = [...defaultTokens?.["tokens"], ...coingeckoTokenList, defaultEth]

  /* init slippage */
  const defaultSlippage = 0.005
  React.useEffect(() => {
    setState({ slippage: defaultSlippage * 100 })
  }, [])

  const [tokens, setTokens] = React.useState({
    token0: token,
    token1: undefined,
  })

  const handlePickToken = React.useCallback(
    picked => {
      const index = defaultTokenList.findIndex(token => token.symbol === picked.symbol)
      const hasTokenIndex = bbyDaoTokens.findIndex(token => token.tokenAddress === defaultTokenList[index]?.address)
      let existingToken = undefined
      if (hasTokenIndex >= 0) {
        existingToken = bbyDaoTokens[hasTokenIndex]
      }
      setRoutePathAsSymbols([])

      if (picked?.symbol === "ETH") {
        const hasTokenIndex = bbyDaoTokens.findIndex(
          token => token.tokenAddress === null && parseInt(token.ethValue) === 1
        )

        existingToken = {
          ...bbyDaoTokens[hasTokenIndex],
          decimals: 18,
          logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
          name: "Ether",
          symbol: "ETH",
        }
      }
      const token1 = {
        ...defaultTokenList[index],
        address: ethers.utils.getAddress(defaultTokenList[index]?.address),
        balance: !!existingToken ? existingToken?.balance : 0,
        ethValue: !!existingToken ? existingToken?.ethValue : 0,
        fiatBalance: !!existingToken ? existingToken?.fiatBalance : 0,
        fiatCode: !!existingToken ? existingToken?.fiatCode : "USD",
      }
      setTokens({ ...tokens, token1 })
      setOpenSearch(false)
    },
    [defaultTokenList, tokens]
  )

  const switchTokenPlacement = React.useCallback(() => {
    setState(state => ({ ...state, [tokens.token0?.symbol]: "", [tokens.token1?.symbol]: "" }))
    setTokens({ token0: tokens.token1, token1: tokens.token0 })
  }, [tokens])

  const WETHToken = React.useMemo(() => {
    return new Token(ChainId.MAINNET, WETH, 18, "WETH", "Wrapped Ether")
  }, [WETH, ChainId, Token])

  const USDTToken = React.useMemo(() => {
    return new Token(ChainId.MAINNET, WETH, 6, "USDT", "Tether USD")
  }, [WETH, ChainId, Token])

  const routeThroughUSDT = async uniswapTokens => {
    try {
      console.log("aaa", uniswapTokens[tokens.token0.symbol], USDTToken)
      const Token0USDT = await Fetcher.fetchPairData(uniswapTokens[tokens.token0.symbol], USDTToken)
      console.log("TOKE", Token0USDT)
      const USDTToken1 = await Fetcher.fetchPairData(USDTToken, uniswapTokens[tokens.token1.symbol])

      const pair0Contract = new ethers.Contract(
        ethers.utils.getAddress(Token0USDT?.liquidityToken?.address),
        IUniswapV2Pair["abi"],
        signer
      )
      const pair1Contract = new ethers.Contract(
        ethers.utils.getAddress(USDTToken1?.liquidityToken?.address),
        IUniswapV2Pair["abi"],
        signer
      )

      const totalSupply0 = await pair0Contract?.totalSupply()
      const hasLiquidity0 =
        parseInt((totalSupply0.toString() / 10 ** Token0USDT?.liquidityToken?.decimals).toFixed()) > 0

      const totalSupply1 = await pair1Contract?.totalSupply()
      const hasLiquidity1 = parseInt((totalSupply1 / 10 ** Token0USDT?.liquidityToken?.decimals).toFixed()) > 0

      setHasNoLiquidity(!hasLiquidity0 || !hasLiquidity1)
      setPoolExists(false)

      return [Token0USDT, USDTToken1]
    } catch (err) {
      setHasNoLiquidity(true)
      setPoolExists(false)
      console.log("er2", err)
    }
  }

  const routeThroughWETH = async uniswapTokens => {
    try {
      const Token0WETH = await Fetcher.fetchPairData(uniswapTokens[tokens.token0.symbol], WETHToken)
      const WETHToken1 = await Fetcher.fetchPairData(WETHToken, uniswapTokens[tokens.token1.symbol])

      const pair0Contract = new ethers.Contract(
        ethers.utils.getAddress(Token0WETH?.liquidityToken?.address),
        IUniswapV2Pair["abi"],
        signer
      )
      const pair1Contract = new ethers.Contract(
        ethers.utils.getAddress(WETHToken1?.liquidityToken?.address),
        IUniswapV2Pair["abi"],
        signer
      )

      const totalSupply0 = await pair0Contract?.totalSupply()
      const hasLiquidity0 =
        parseInt((totalSupply0.toString() / 10 ** Token0WETH?.liquidityToken?.decimals).toFixed()) > 0

      const totalSupply1 = await pair1Contract?.totalSupply()
      const hasLiquidity1 = parseInt((totalSupply1 / 10 ** Token0WETH?.liquidityToken?.decimals).toFixed()) > 0

      setHasNoLiquidity(!hasLiquidity0 || !hasLiquidity1)
      setPoolExists(false)

      return [Token0WETH, WETHToken1]
    } catch (err) {
      if (!!uniswapTokens) {
        setHasNoLiquidity(true)
        setPoolExists(false)
      }
      console.log("err", err)
    }
  }

  const uniswapTokens = React.useMemo(() => {
    if (!!tokens?.token0 && !!tokens?.token1) {
      const token0 = tokens?.token0
      const token1 = tokens?.token1
      const uniToken0 = new Token(ChainId.MAINNET, token0?.address, token0?.decimals, token0?.symbol, token0?.name)
      const uniToken1 = new Token(ChainId.MAINNET, token1?.address, token1?.decimals, token1?.symbol, token1?.name)
      return { [token0.symbol]: uniToken0, [token1.symbol]: uniToken1 }
    }
  }, [tokens])

  const uniPair = React.useMemo(async () => {
    const hasEth = tokens?.token0.symbol === "ETH" || tokens?.token1.symbol === "ETH"
    setIsEthOnEth(false)

    try {
      if (!!uniswapTokens) {
        const uniPair = await Fetcher.fetchPairData(
          uniswapTokens[tokens.token0.symbol],
          uniswapTokens[tokens.token1.symbol]
        )
        const pairContract = new ethers.Contract(
          ethers.utils.getAddress(uniPair?.liquidityToken.address),
          IUniswapV2Pair["abi"],
          signer
        )
        const totalSupply = await pairContract?.totalSupply()
        const hasLiquidity = parseInt((totalSupply.toString() / 10 ** uniPair?.liquidityToken?.decimals).toFixed()) > 0

        if (!hasLiquidity && !hasEth) {
          if (!hasEth) {
            return await routeThroughWETH(uniswapTokens)
          } else {
            return await routeThroughUSDT(uniswapTokens)
          }
        }

        setHasNoLiquidity(!hasLiquidity)
        setPoolExists(true)
        return uniPair
      }
    } catch (err) {
      if (!!uniswapTokens) {
        const isETHtoWETH =
          uniswapTokens[tokens.token0.symbol]?.symbol === "ETH" && uniswapTokens[tokens.token1.symbol]?.address === WETH
        const isWETHtoETH =
          uniswapTokens[tokens.token1.symbol]?.symbol === "ETH" && uniswapTokens[tokens.token0.symbol]?.address === WETH

        if (isETHtoWETH || isWETHtoETH) {
          setIsEthOnEth(true)

          return
        }
        if (!hasEth) {
          return await routeThroughWETH(uniswapTokens)
        } else {
          return await routeThroughUSDT(uniswapTokens)
        }
      }
      console.log("err", err)
    }
  }, [uniswapTokens])

  const showApprove = React.useMemo(
    () =>
      hasNoLiquidity === false &&
      hasAllowance?.token0 === false &&
      !!tokens?.token0 &&
      tokens?.token0.symbol !== "ETH" &&
      !!tokens?.token1,
    [hasNoLiquidity, hasAllowance, tokens]
  )

  /*
   *
   * Allowance Check:
   *
   * Check whether the spender (uniswapV2Router02) is allowed to
   * spend (TransferFrom) the two Tokens that compose the Pair
   * on behalf of the owner (bbyDao).
   *
   * */
  const tokenContracts = React.useMemo(async () => {
    const { token0, token1 } = tokens
    try {
      let token0Contract, token1Contract, token0AllowanceAmount, token1AllowanceAmount

      if (!!signer) {
        if (!!token0) {
          token0Contract = new ethers.Contract(token0?.address, minimalABI, signer)
          const allowance = await token0Contract.allowance(bbyDao, UniswapV2Router02)
          token0AllowanceAmount = await NumberFromBig(allowance?._hex, token0.decimals)
        }

        if (!!token1) {
          token1Contract = new ethers.Contract(token1?.address, minimalABI, signer)
          const allowance = await token1Contract.allowance(bbyDao, UniswapV2Router02)
          token1AllowanceAmount = await NumberFromBig(allowance?._hex, token1.decimals)
        }
      }

      return {
        contracts: [token0Contract, token1Contract],
        allowedToSpend: { token0: token0AllowanceAmount > 0, token1: token1AllowanceAmount > 0 },
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [tokens])
  React.useMemo(async () => {
    try {
      const allowed = await tokenContracts

      setHasAllowance({ ...hasAllowance, ...allowed?.allowedToSpend })
    } catch (err) {
      console.log("err", err)
    }
  }, [tokenContracts])

  /*
   * Approve Tokens:
   *
   * Send a gnosis transaction to allow the spender (uniswapV2Router02)
   * to spend the token being approved on behalf of the owner (bbyDao)
   *
   * */
  const handleApproveToken = async (tokenContracts, index) => {
    try {
      const contracts = await tokenContracts
      const contract = await contracts.contracts[index]
      const tx = gnosisTransaction(
        {
          abi: minimalABI,
          instance: contract,
          fn: "approve(address,uint256)",
          args: {
            spender: UniswapV2Router02,
            value: BigNumber.from(max256),
          },
        },
        contract?.address,
        0
      )
      console.log("tx", tx)
    } catch (err) {
      console.log("err", err)
    }
  }

  /*
   * Format Routes:
   *
   * Display Route taken for swap
   *
   * */
  const [routePathAsSymbols, setRoutePathAsSymbols] = React.useState([])
  const routePathString = React.useMemo(() => {
    let path = ""
    if (routePathAsSymbols.length > 0) {
      for (const symbol of routePathAsSymbols) {
        path += `${symbol} > `
      }

      return path.slice(0, -2)
    } else {
      return ""
    }
  }, [routePathAsSymbols])

  /*
   * Handle Value Input:
   *
   * Logic for setting token amounts
   *
   * */
  const handleSetTokenValue = async (e, token, tokenRef) => {
    try {
      const bal = token?.balance
      const dec = token?.decimals
      const max = bal / 10 ** dec
      const token0Input = e?.target?.valueAsNumber
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.symbol)[0][1]

      if (isEthOnEth) {
        if (token0Input > max) {
          handleSetMaxTokenValue(token, tokenRef)
        } else {
          setState(state => ({ ...state, [token.symbol]: token0Input }))
          setState(state => ({ ...state, [token1?.symbol]: token0Input }))
        }
        return
      }

      const route = new Route(
        Array.isArray(await uniPair) ? await uniPair : [await uniPair],
        uniswapTokens[token.symbol]
      )
      setRoutePathAsSymbols(
        route.path.reduce((acc = [], cv) => {
          acc.push(cv.symbol)
          return acc
        }, [])
      )
      const midPrice = route.midPrice.toSignificant(6)
      const token1Input = Number(token0Input * midPrice)

      if (token0Input > max) {
        handleSetMaxTokenValue(token, tokenRef)
      } else {
        setState(state => ({ ...state, [token.symbol]: token0Input }))
        setState(state => ({ ...state, [token1?.symbol]: token1Input }))
      }
    } catch (err) {
      console.log("err", err)
    }
  }
  const handleSetMaxTokenValue = async (token, tokenRef) => {
    try {
      const token0Input = tokenRef?.current?.max
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.symbol)[0][1]

      if (isEthOnEth) {
        setState(state => ({ ...state, [token?.symbol]: token0Input }))
        setState(state => ({ ...state, [token1?.symbol]: token0Input }))
        return
      }

      const route = new Route(
        Array.isArray(await uniPair) ? await uniPair : [await uniPair],
        uniswapTokens[token.symbol]
      )
      setRoutePathAsSymbols(
        route.path.reduce((acc = [], cv) => {
          acc.push(cv.symbol)
          return acc
        }, [])
      )
      const midPrice = route.midPrice.toSignificant(6)
      const token1Input = token0Input * midPrice

      setState(state => ({ ...state, [token?.symbol]: token0Input }))
      setState(state => ({ ...state, [token1.symbol]: token1Input }))
    } catch (err) {
      console.log("err", err)
    }
  }
  const handleSwapToken = async (token0, token1) => {
    try {
      const uniswapV2RouterContract02 = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02["abi"], signer)
      const slippage = state?.slippage / 100 || defaultSlippage
      const inputToken = {
        token: tokens.token0,
        value: parseFloat(token0.toString()),
      }
      const outputToken = {
        token: tokens.token1,
        value: parseFloat(token1.toString()) - parseFloat(token1.toString()) * slippage,
      }

      const swapExactTokensForTokens = inputToken.token.symbol !== "ETH" && outputToken.token.symbol !== "ETH"
      const swapExactETHForTokens = !isEthOnEth && inputToken.token.symbol === "ETH"
      const swapExactTokensForETH = !isEthOnEth && outputToken.token.symbol === "ETH"

      if (isEthOnEth) {
        const WETHContract = new ethers.Contract(WETH, WETHABI, signer)
        const wad = ethers.utils.parseUnits(inputToken.value.toString(), inputToken?.token?.decimals)
        if (inputToken.token.symbol === "WETH") {
          const tx = gnosisTransaction(
            {
              abi: WETHABI,
              instance: WETHContract,
              fn: "withdraw(uint256)",
              args: {
                wad,
              },
            },
            WETH,
            0,
            await calculateFee([{ value: wad }])
          )
          console.log("tx", tx)
        } else {
          const tx = gnosisTransaction(
            {
              abi: WETHABI,
              instance: WETHContract,
              fn: "deposit()",
            },
            WETH,
            wad,
            await calculateFee([{ value: wad }])
          )
          console.log("tx", tx)
        }
      }

      if (swapExactTokensForTokens) {
        const amountIn = ethers.utils.parseUnits(inputToken.value.toString(), inputToken?.token?.decimals)
        const amountOutMin = ethers.utils.parseUnits(outputToken.value.toString(), outputToken?.token?.decimals)
        let path

        if (poolExists) {
          path = [ethers.utils.getAddress(inputToken.token.address), ethers.utils.getAddress(outputToken.token.address)]
        } else {
          path = [
            ethers.utils.getAddress(inputToken.token.address),
            WETH,
            ethers.utils.getAddress(outputToken.token.address),
          ]
        }

        const tx = gnosisTransaction(
          {
            abi: IUniswapV2Router02["abi"],
            instance: uniswapV2RouterContract02,
            fn: "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            args: {
              amountIn,
              amountOutMin,
              path,
              addressTo: ethers.utils.getAddress(bbyDao),
              deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            },
          },
          UniswapV2Router02,
          0,
          await calculateFee([{ value: amountIn, token: inputToken.token }])
        )
        console.log("tx", tx)
      }

      if (swapExactETHForTokens) {
        const amountOutMin = ethers.utils.parseUnits(outputToken.value.toString(), outputToken?.token?.decimals)
        const value = ethers.utils.parseUnits(inputToken.value.toString())
        const tx = gnosisTransaction(
          {
            abi: IUniswapV2Router02["abi"],
            instance: uniswapV2RouterContract02,
            fn: "swapExactETHForTokens(uint256,address[],address,uint256)",
            args: {
              amountOutMin,
              path: [WETH, ethers.utils.getAddress(outputToken.token.address)],
              addressTo: ethers.utils.getAddress(bbyDao),
              deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            },
          },
          UniswapV2Router02,
          value,
          await calculateFee([{ value }])
        )
        console.log("tx", tx)
      }

      if (swapExactTokensForETH) {
        const amountIn = ethers.utils.parseUnits(inputToken.value.toString(), inputToken?.token?.decimals)
        const amountOutMin = ethers.utils.parseUnits(outputToken.value.toString(), outputToken?.token?.decimals)

        const tx = gnosisTransaction(
          {
            abi: IUniswapV2Router02["abi"],
            instance: uniswapV2RouterContract02,
            fn: "swapExactTokensForETH(uint256,uint256,address[],address,uint256)",
            args: {
              amountIn,
              amountOutMin,
              path: [ethers.utils.getAddress(inputToken.token.address), WETH],
              addressTo: ethers.utils.getAddress(bbyDao),
              deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            },
          },
          UniswapV2Router02,
          0,
          await calculateFee([{ value: amountIn, token: inputToken.token }])
        )
        console.log("tx", tx)
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  return (
    <div>
      {tokens?.token0 && (
        <TokenInput
          tokens={tokens}
          pair={uniPair}
          tokenInputRef={token0InputRef}
          token={tokens?.token0}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          state={state}
          logo={tokens?.token0?.logoURI}
          autoComplete="off"
          setOpenSearch={setOpenSearch}
          isSwap={true}
        />
      )}
      <button
        type="button"
        onClick={() => (tokens?.token0 && tokens?.token1 ? switchTokenPlacement() : () => {})}
        className="m-auto my-4 flex"
      >
        {parseFloat(state[tokens?.token0?.symbol]) > 0 && parseFloat(state[tokens?.token1?.symbol]) > 0 ? (
          <HiArrowSmDown size={26} />
        ) : (
          <HiOutlineSwitchVertical size={26} />
        )}
      </button>
      <TokenInput
        tokens={tokens}
        pair={uniPair}
        tokenInputRef={token1InputRef}
        token={tokens?.token1}
        handleSetTokenValue={handleSetTokenValue}
        handleSetMaxTokenValue={handleSetMaxTokenValue}
        state={state}
        logo={tokens?.token1?.logoURI}
        autoComplete="off"
        setOpenSearch={setOpenSearch}
        isSwap={true}
      />
      {openSearch && <TokenSearch token={token} tokenList={defaultTokenList} handlePickToken={handlePickToken} />}

      {routePathString?.length > 0 && <div className="py-4 text-sm font-thin">Route: {routePathString}</div>}
      {showApprove && (
        <div className="my-4 flex w-full justify-center gap-4">
          <div
            className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
            onClick={() => handleApproveToken(tokenContracts, 0)}
          >
            Approve {tokens?.token0?.symbol}
          </div>
        </div>
      )}
      {!showApprove && (
        <div className="my-4 flex w-full justify-center gap-4">
          <button
            type="button"
            disabled={hasNoLiquidity}
            className={`focus:shadow-outline flex h-16 w-full w-full
           appearance-none items-center justify-center rounded-full 
          bg-slate-300 py-2 px-3 text-xl font-normal leading-tight text-white focus:outline-none dark:bg-slate-700 ${
            !hasNoLiquidity ? "bg-sky-500 hover:bg-sky-600 dark:bg-orange-600 dark:hover:bg-orange-700" : ""
          }`}
            onClick={
              !hasNoLiquidity
                ? () => handleSwapToken(state[tokens?.token0?.symbol], state[tokens?.token1?.symbol])
                : () => {}
            }
          >
            {hasNoLiquidity ? `No Liquidity` : `Swap ${tokens?.token0?.symbol} for ${tokens?.token1?.symbol}`}
          </button>
        </div>
      )}

      <Slippage
        value={state?.slippage}
        handleChange={handleChange}
        defaultSlippage={defaultSlippage * 100}
        setState={setState}
      />
    </div>
  )
}

export default Swap
