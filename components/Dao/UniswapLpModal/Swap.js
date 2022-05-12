import { ChainId, Token } from "@uniswap/sdk"
import defaultTokens from "@uniswap/default-token-list"
import { BigNumber, ethers } from "ethers"
import React from "react"
import useForm from "hooks/useForm"
import { HiOutlineSwitchVertical } from "react-icons/hi"
import { useQueryClient } from "react-query"
import { flatten, max256, NumberFromBig } from "utils/helpers"
import { useSigner } from "wagmi"
import { minimalABI } from "../../../hooks/useERC20Contract"
import TokenInput from "./TokenInput"
import useGnosisTransaction from "hooks/useGnosisTransaction"

const Swap = ({ token }) => {
  const [{ data: signer }] = useSigner()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const [hasAllowance, setHasAllowance] = React.useState()
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { state, handleChange } = useForm()
  const defaultTokenList = defaultTokens?.["tokens"]
  const isEth = React.useMemo(() => {
    if (parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null) {
      return {
        ...token,
        token: {
          decimals: 18,
          logoUri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
          name: "Ether",
          symbol: "ETH",
        },
        address: WETH,
      }
    }
    return { ...token, address: token?.tokenAddress }
  }, [token])
  const [tokens, setTokens] = React.useState({
    token0: flatten(isEth),
    token1: undefined,
  })

  const tokenNames = React.useMemo(() => {
    return defaultTokenList?.reduce((acc = [], cv) => {
      acc.push(cv.symbol)
      return acc
    }, [])
  }, [defaultTokenList])

  const tokensBySymbol = React.useMemo(() => {
    return tokenNames.reduce((acc = [], cv) => {
      if (cv?.toUpperCase().includes(state?.symbol?.toUpperCase()) && !acc?.includes(cv?.toUpperCase())) {
        acc.push(cv?.toUpperCase())
      }

      return acc
    }, [])
  }, [state.symbol])

  const handlePickToken = React.useCallback(
    picked => {
      const index = defaultTokenList.findIndex(token => token.symbol === picked)

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
    },
    [tokens]
  )

  const switchTokenPlacement = React.useCallback(() => {
    setTokens({ token0: tokens.token1, token1: tokens.token0 })
  }, [tokens])

  const uniPair = React.useMemo(() => {
    if (!!tokens?.token0 && !!tokens?.token1) {
      const token0 = tokens?.token0
      const token1 = tokens?.token1
      const uniToken0 = new Token(ChainId.MAINNET, token0?.address, token0?.decimals, token0?.symbol, token0?.name)
      const uniToken1 = new Token(ChainId.MAINNET, token1?.address, token1?.decimals, token1?.symbol, token1?.name)
      return { [token0.symbol]: uniToken0, [token1.symbol]: uniToken1 }
    }
  }, [tokens])

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

  return (
    <div>
      <form>
        <div>
          {console.log("tokens", tokens)}
          {console.log("uni", uniPair)}
          {console.log("contracts", tokenContracts)}
          {console.log("has", hasAllowance)}
        </div>
        {tokens?.token0 && (
          <div>
            <div> {tokens.token0?.symbol}</div>
          </div>
        )}
        {tokens?.token0 && tokens?.token1 && (
          <button type="button" onClick={() => switchTokenPlacement()}>
            <HiOutlineSwitchVertical size={20} />
          </button>
        )}
        {tokens?.token1 && (
          <div>
            <div>{tokens.token1?.symbol}</div>
          </div>
        )}
        <input
          id="symbol"
          name="symbol"
          onChange={handleChange}
          value={state?.symbol || ""}
          className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-3xl leading-tight focus:outline-none dark:bg-slate-800"
          placeholder={"Type to search"}
        />
        <div>
          {tokensBySymbol && tokensBySymbol?.length > 0 && (
            <div className="flex max-h-96 flex-col overflow-y-scroll pt-4">
              {tokensBySymbol.map(token => (
                <button
                  key={token}
                  type="button"
                  onClick={() => handlePickToken(token)}
                  className="mb-2 inline-flex self-start rounded-full bg-slate-300 p-2 font-light dark:bg-slate-600 hover:dark:bg-slate-700"
                >
                  {token?.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
      <div className="my-4 flex w-full justify-center gap-4">
        {!hasAllowance?.token0 && tokens?.token0 && tokens?.token1 && (
          <div
            className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
            onClick={() => handleApproveToken(tokenContracts, 0)}
          >
            Approve {tokens?.token0?.symbol}
          </div>
        )}
        {/*Only need allowance for input token*/}
        {/*{!hasAllowance?.token1 && tokens?.token0 && tokens?.token1 && (*/}
        {/*  <div*/}
        {/*    className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"*/}
        {/*    onClick={() => handleApproveToken(tokenContracts, 1)}*/}
        {/*  >*/}
        {/*    Approve {tokens?.token1?.symbol}*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  )
}

export default Swap
