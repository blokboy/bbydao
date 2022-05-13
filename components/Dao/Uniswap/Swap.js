import { ChainId, Fetcher, Route, Token } from "@uniswap/sdk"
import defaultTokens from "@uniswap/default-token-list"
import { BigNumber, ethers } from "ethers"
import React from "react"
import useForm from "hooks/useForm"
import { HiOutlineSwitchVertical } from "react-icons/hi"
import { useQueryClient } from "react-query"
import { flatten, max256, NumberFromBig } from "utils/helpers"
import { useSigner } from "wagmi"
import { minimalABI } from "../../../hooks/useERC20Contract"
import { getLiquidityPairInfo, readableTokenBalance } from "./helpers"
import TokenInput from "./TokenInput"
import useGnosisTransaction from "hooks/useGnosisTransaction"

const Swap = ({ token }) => {
  const [{ data: signer }] = useSigner()
  const queryClient = useQueryClient()
  const token0InputRef = React.useRef()
  const token1InputRef = React.useRef()
  const [openSearch, setOpenSearch] = React.useState(false)
  const bbyDao = queryClient.getQueryData("expandedDao")
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const [hasAllowance, setHasAllowance] = React.useState()
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { state, setState, handleChange } = useForm()
  const defaultTokenList = defaultTokens?.["tokens"]
  const isEth = React.useMemo(() => {
    if (parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null) {
      return {
        ...token,
        token: {
          decimals: 18,
          logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
          name: "Ether",
          symbol: "ETH",
        },
        address: WETH,
        tokenAddress: "",
      }
    }

    return { ...token, address: token?.tokenAddress, logoURI: token?.token?.logoUri }
  }, [token])
  const [tokens, setTokens] = React.useState({
    token0: flatten(isEth),
    token1: undefined,
  })

  const tokenSymbols = React.useMemo(() => {
    return defaultTokenList?.reduce((acc = [], cv) => {
      if (acc.filter(item => item.symbol === cv.symbol).length < 1) acc.push({ symbol: cv.symbol, uri: cv.logoURI })

      return acc
    }, [])
  }, [defaultTokenList])

  const filteredTokensBySymbol = React.useMemo(() => {
    return tokenSymbols.reduce((acc = [], cv) => {
      if (cv?.symbol?.toUpperCase().includes(state?.symbol?.toUpperCase())) {
        acc.push(cv)
      }

      return acc
    }, [])
  }, [state.symbol])

  const handlePickToken = React.useCallback(
    picked => {
      const index = defaultTokenList.findIndex(token => token.symbol === picked.symbol)

      //check if user has token in list if so populate obj with gnosis data
      //TODO: component should be aware of token list, react Query thing?

      const token1 = {
        ...defaultTokenList[index],
        balance: 0,
        ethValue: 0,
        fiatBalance: 0,
        fiatCode: "USD",
      }
      setTokens({ ...tokens, token1 })
      setOpenSearch(false)
    },
    [tokens]
  )

  const switchTokenPlacement = React.useCallback(() => {
    setTokens({ token0: tokens.token1, token1: tokens.token0 })
  }, [tokens])

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
    if (!!uniswapTokens) {
      const uniPair = await Fetcher.fetchPairData(
        uniswapTokens[tokens.token0.symbol],
        uniswapTokens[tokens.token1.symbol]
      )
      return uniPair
    }
  }, [uniswapTokens])
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
      gnosisTransaction(
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
      const token0 = Object.entries(uniswapTokens).filter(item => item[0] === token.symbol)[0][1]
      const token0Input = e?.target?.valueAsNumber
      const route = new Route([await uniPair], uniswapTokens[token.symbol])
      const midPrice = route.midPrice.toSignificant(6)
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.symbol)[0][1]
      const token1Input = Number(token0Input * midPrice)
      const pairToken = tokens?.token0.symbol === token.symbol ? tokens?.token1 : tokens?.token0

      /*  If User attempts to LP more than balance, default to max balance */
      if (token0Input > max) {
        handleSetMaxTokenValue(token, tokenRef)
      } else {
        setState(state => ({ ...state, [token.symbol]: token0Input }))
        setState(state => ({ ...state, [token1?.symbol]: token1Input }))

        if (!isNaN(token0Input) && !isNaN(token1Input) && token0Input > 0 && token1Input > 0) {
          // const liquidityInfo = await getLiquidityPairInfo({
          //   pair: pair,
          //   token0: token0,
          //   token0Input: token0Input,
          //   token0ETHConversion: token.ethValue || 0,
          //   token1: token1,
          //   token1Input: token1Input,
          //   token1ETHConversion: pairToken.ethValue || 0,
          //   abi: IUniswapV2ERC20.abi,
          // })
          // setLiquidityInfo(liquidityInfo)
        }
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  /* Handle setting max token values and retrieving liquidity pair information  */
  const handleSetMaxTokenValue = async (token, tokenRef) => {
    console.log("in", uniswapTokens)
    try {
      const token0 = uniswapTokens[token.symbol]
      const token0Input = tokenRef?.current?.max
      const pairToken = tokens?.token0.symbol === token.symbol ? tokens?.token1 : tokens?.token0

      const route = new Route([await uniPair], uniswapTokens[token.symbol])
      const midPrice = route.midPrice.toSignificant(6)
      const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.symbol)[0][1]
      const token1Input = token0Input * midPrice

      setState(state => ({ ...state, [token?.symbol]: token0Input }))
      setState(state => ({ ...state, [token1.symbol]: token1Input }))

      // const liquidityInfo = await getLiquidityPairInfo({
      //   pair: pair,
      //   token0: token0,
      //   token0Input: token0Input,
      //   token0ETHConversion: token.ethValue || 0,
      //   token1: token1,
      //   token1Input: token1Input,
      //   token1ETHConversion: pairToken.ethValue || 0,
      //   abi: IUniswapV2ERC20.abi,
      // })
      // setLiquidityInfo(liquidityInfo)
    } catch (err) {
      console.log("err", err)
    }
  }

  const handleSwapToken = (token0, token1) => {
    const inputToken = {
      token: tokens.token0,
      value: parseFloat(token0.toString())
    }
    const outputToken = {
      token: tokens.token1,
      value: parseFloat(token1.toString())
    }

    console.log('input', inputToken)
    console.log('output', outputToken)


  }

  return (
    <div>
      <form>
        {tokens?.token0 && (
          <TokenInput
            pair={uniPair}
            tokenInputRef={token0InputRef}
            lpToken={tokens?.token0}
            handleSetTokenValue={handleSetTokenValue}
            handleSetMaxTokenValue={handleSetMaxTokenValue}
            readableTokenBalance={readableTokenBalance}
            state={state}
            logo={tokens?.token0?.logoURI}
            autoComplete="off"
            setOpenSearch={setOpenSearch}
          />
        )}
        <button
          type="button"
          onClick={() => (tokens?.token0 && tokens?.token1 ? switchTokenPlacement() : () => {})}
          className="m-auto my-4 flex"
        >
          <HiOutlineSwitchVertical size={26} />
        </button>
        <TokenInput
          pair={uniPair}
          tokenInputRef={token1InputRef}
          lpToken={tokens?.token1}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          readableTokenBalance={readableTokenBalance}
          state={state}
          logo={tokens?.token1?.logoURI}
          autoComplete="off"
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
          <div className="mt-4 flex max-h-96 flex-wrap gap-1 overflow-y-scroll pt-4">
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
      </form>
      <div className="my-4 flex w-full justify-center gap-4">
        {hasAllowance?.token0 === false && tokens?.token0 && tokens?.token1 && (
          <div
            className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
            onClick={() => handleApproveToken(tokenContracts, 0)}
          >
            Approve {tokens?.token0?.symbol}
          </div>
        )}
        {/*Only need allowance for input token*/}
        {!!state[tokens?.token0?.symbol] && !!state[tokens?.token1?.symbol] && (
          <div
            className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
            onClick={() => handleSwapToken(state[tokens?.token0?.symbol], state[tokens?.token1?.symbol])}
          >
            Swap {tokens?.token0?.symbol} for {tokens?.token1?.symbol}
          </div>
        )}
      </div>
      {console.log('STATE', state, state[tokens?.token0?.symbol], state[tokens?.token1?.symbol])}
    </div>
  )
}

export default Swap
